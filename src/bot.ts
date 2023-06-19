import {
  Bot,
  InlineKeyboard,
  webhookCallback,
  session,
  Context
} from "grammy";
import getData from './dompul.js';
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation
} from "@grammyjs/conversations";

import {
  chunk
} from "lodash";
import express from "express";
import {
  readData,
  addData,
  removeData
} from "./redis.js"

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation < MyContext >;


// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "5824625543:AAEslB26tupftKCDQTs0OULDa1uYWxv6XfM");



bot.use(session({
  initial() {
    // return empty object for now
    return {};
  },
}));
bot.use(conversations());
bot.use(createConversation(addAccount, 'add-account'))

async function addAccount(conversation: MyConversation, ctx: MyContext) {
  //await ctx.deleteMessage()
  await ctx.reply("Masukan nama akun");
  const name = await conversation.wait();
  //@ts-ignore
  ctx.session.name = name.message.text
  await ctx.reply(`Masukan nomor akun, ${name.message.text}!`);
  const num = await conversation.wait();
  //@ts-ignore
  ctx.session.num = num.message.text



  // Simpan name dan number ke dalam database berdasarkan ID user


  await addData(ctx.from.id, {
    name: name.message.text, phone: num.message.text.replace(/[^\d]/g, '')});

  // Menutup koneksi ke server MongoDB

  await ctx.reply('akun berhasil disimpan ')
  //await ctx.reply(`akun, ${name.message.text} - ${num.message.text}!`);
  ctx.session = {}
  await showMenu(ctx)
}


bot.command("start", async (ctx) => {
  await showMenu(ctx)
});






bot.callbackQuery("tambah", async (ctx) => {
  //@ts-ignore
  await ctx.conversation.enter("add-account")
  await ctx.deleteMessage()
  await ctx.answerCallbackQuery()
});
bot.callbackQuery("hapus", async (ctx) => {
  await ctx.deleteMessage()
  await showMenuDelete(ctx)
})

bot.callbackQuery(/^\/remove_(.*)$/, async (ctx) => {
  await ctx.deleteMessage()
  await ctx.api.sendChatAction(ctx.chat.id, 'typing');
  const message = ctx.match[1].split('-')
  const index = message[0]
  const phone = message[1]
  const inlineKeyboard = new InlineKeyboard().text('Hapus', `/confirm_${index}`).text('Batal', `/batal`)
  await ctx.api.sendChatAction(ctx.chat.id, 'typing');

  console.log('index = ', index)
  console.log('phone = ', phone)

  ctx.reply(`Apakah anda yakin akan menghapus akun dengan nomor - ${phone}`, {
    reply_markup: inlineKeyboard
  })
})

bot.callbackQuery(/^\/confirm_(.*)$/, async (ctx) => {
  const index = ctx.match[1]
  console.log(ctx.from.id)
  console.log(index)
  await ctx.deleteMessage()
  await ctx.api.sendChatAction(ctx.chat.id, 'typing');
  try {
    await removeData(ctx.from.id, index)
    await ctx.reply('Akun berhasil dihapus')
    await showMenu(ctx)
  } catch (err) {
    await ctx.reply('Gagal menghapus Akun!')
  }
})
bot.callbackQuery('/batal', async (ctx)=> {
  await ctx.deleteMessage()
  await showMenu(ctx)
})

bot.callbackQuery(/^\/number_(.*)$/, async (ctx) => {
  await ctx.api.sendChatAction(ctx.chat.id, 'typing');
  const number = ctx.match[1]
  const data = await getData(number)
  await ctx.deleteMessage()
  if (data.packageInfo) {
    console.log(data)
    await sendResultToUser(ctx, data.packageInfo)

  } else {


    await ctx.reply(data)

  }
});
// Suggest commands in the menu
bot.api.setMyCommands([{
  command: "menu",
  description: "show menu",
},
]);

// Handle all other messages and the /start command
const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by Cyclic, the next-generation serverless computing platform.

<b>Commands</b>
/yo - Be greeted by me
/effect [text] - Show a keyboard to apply text effects to [text]`;

bot.command("menu", async (ctx)=> {
  await showMenu(ctx)
})

bot.command("setMenu", async (ctx)=> {
  await bot.api.setMyCommands([{
    command: "yo", description: "Be greeted by the bot"
  },
    {
      command: "effect",
      description: "Apply text effects on the text. (usage: /effect [text])",
    },
    {
      command: "menu",
      description: "show menu",
    },
  ]);
})




async function showMenuDelete(ctx) {
  const inlineKeyboard = new InlineKeyboard();
  await ctx.api.sendChatAction(ctx.chat.id,
    'typing');
  // Mendapatkan daftar nomor pengguna dari koleksi "numbers"
  const numbers = await readData(ctx.from.id)
  numbers.forEach((option, index) => {
    inlineKeyboard.text(option.name.toUpperCase() + ' - ' + option.phone, `/remove_${index}-${option.phone}`).row();
  });


  await ctx.reply(`Pilih akun yang akan dihapus`,
    {
      reply_markup: inlineKeyboard
    })
}

async function showMenu(ctx) {
  const inlineKeyboard = new InlineKeyboard();
  await ctx.api.sendChatAction(ctx.chat.id,
    'typing');
  // Mendapatkan daftar nomor pengguna dari koleksi "numbers"
  const numbers = await readData(ctx.from.id)
  if (numbers) {
    numbers.forEach((option) => {
      inlineKeyboard.text(option.name.toUpperCase(), '/number_'+option.phone).row(); // Menambahkan tombol dengan teks dan nilai yang sama
    });
  }
  inlineKeyboard.text('➕ Tambah ', 'tambah')
  inlineKeyboard.text('❌  Hapus ', 'hapus')
  let list = ''
  if (numbers) {
    numbers.map((number, i) => {
      list += `${i+1}. ${number.name.toUpperCase()} - ${number.phone}\n`
    })
  }
  await ctx.reply(`ID : ${ctx.from.id}\n\nDaftar Nomor Tersimpan: \n${list}`, {
    reply_markup: inlineKeyboard
  })
}


function sendResultToUser(ctx, data) {
  // Ubah format hasil menjadi pesan yang dapat dikirim ke pengguna
  let message = '';
  message += `ID : ${ctx.from.id}\n\n`
  message += 'info Paket Aktif\n'

  data.forEach((item,
    index,
    arr) => {
    const name = item[0].packages.name
    const expDate = item[0].packages.expDate.split(' ')[0]
    message += `📦 Nama Paket: ${name}\n`;
    message += `📅 Expired: ${expDate}\n`;
    message += `===========================\n`;
    const bname = item[0].benefits
    bname.forEach((benefit, index, arr) => {
      message += `⭐️ Benefit: ${benefit.bname}\n`;
      message += `💙 Quota: ${benefit.quota}\n`;
      message += `✅ Sisa Quota: ${benefit.remaining}\n`;
      if (index !== arr.length - 1) {
        message += "\n" // Menambahkan jarak dengan \n
      }
    });


    if (index !== arr.length - 1) {
      message += "\n" // Menambahkan jarak dengan \n
    }

    // message += `===========================\n\n`;
  });

  // Kirim pesan ke pengguna
  ctx.reply(message);
  //console.log(message)
}




// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  console.log('run locally')
  bot.start();
}