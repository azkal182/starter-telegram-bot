
import { Bot, InlineKeyboard, webhookCallback,session,Context } from "grammy";
import getData from './dompul.js';
import { type Conversation,
  type ConversationFlavor,conversations,
  createConversation } from "@grammyjs/conversations";
import { MongoClient } from "mongodb";
import { chunk } from "lodash";
import express from "express";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;


// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "5824625543:AAEslB26tupftKCDQTs0OULDa1uYWxv6XfM");

const uri = 'mongodb://localhost:27017';
const dbName = 'sidompul_bot';

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

  // Menghubungkan ke server MongoDB
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  // Simpan name dan number ke dalam database berdasarkan ID user
  await saveNumber(db, ctx.from.id, name.message.text, num.message.text);

  // Menutup koneksi ke server MongoDB
  client.close();
  await ctx.reply('akun berhasil disimpan ')
  //await ctx.reply(`akun, ${name.message.text} - ${num.message.text}!`);
  ctx.session = {}
  await showMenu(ctx)
}

bot.command("start", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard();

  await ctx.api.sendChatAction(ctx.chat.id, 'typing');

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  // Mendapatkan daftar nomor pengguna dari koleksi "numbers"
  const numbers = await getNumbers(db, ctx.from.id);
  numbers.forEach((option) => {
    inlineKeyboard.text(option.name, '/number_'+option.number).row(); // Menambahkan tombol dengan teks dan nilai yang sama
  });
  inlineKeyboard.text('➕ Tambah ', 'tambah')
  inlineKeyboard.text('❌  Hapus ', 'hapus')
  let list = ''

  numbers.map((number, i) => {
    list += `${i+1}. ${number.name} - ${number.number}\n`
  })

  await ctx.reply(`ID : ${ctx.from.id}\n\nDaftar Nomor Tersimpan: \n${list}`, {
    reply_markup: inlineKeyboard
  })

  console.log(numbers)
});






bot.callbackQuery("tambah", async (ctx) => {
   //@ts-ignore
  await ctx.conversation.enter("add-account")
  await ctx.deleteMessage()
  await ctx.answerCallbackQuery()
});


bot.callbackQuery(/^\/number_(.*)$/, async (ctx) => {
  const number = ctx.match[1]
  const data = await getData(number)
  console.log(data)
  await sendResultToUser(ctx, data.packageInfo)
  await ctx.deleteMessage()
  //await ctx.reply("pilih nomor " + number)
  await ctx.answerCallbackQuery()
});
// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "yo", description: "Be greeted by the bot" },
  {
    command: "effect",
    description: "Apply text effects on the text. (usage: /effect [text])",
  },
    {
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

bot.command("menu", async (ctx)=>{
  await showMenu(ctx)
})

bot.command("setMenu", async (ctx)=>{
  await bot.api.setMyCommands([
  { command: "yo", description: "Be greeted by the bot" },
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

async function getNumbers(db,
  userId) {
  const collection = db.collection('numbers');
  const result = await collection.find({
    user_id: userId
  }).toArray();
  return result.map((doc) => doc);
}


async function saveNumber(db,
  userId,
  name,
  number) {
  const collection = db.collection('numbers');
  await collection.insertOne({
    user_id: userId,
    name,
    number
  });
}

async function showMenu(ctx) {
  const inlineKeyboard = new InlineKeyboard();

  await ctx.api.sendChatAction(ctx.chat.id,
    'typing');

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  // Mendapatkan daftar nomor pengguna dari koleksi "numbers"
  const numbers = await getNumbers(db,
    ctx.from.id);
  numbers.forEach((option) => {
    inlineKeyboard.text(option.name, '/number_'+option.number).row(); // Menambahkan tombol dengan teks dan nilai yang sama
  });
  inlineKeyboard.text('➕ Tambah ',
    'tambah')
  inlineKeyboard.text('❌  Hapus ',
    'hapus')
  let list = ''

  numbers.map((number, i) => {
    list += `${i+1}. ${number.name} - ${number.number}\n`
  })

  await ctx.reply(`ID : ${ctx.from.id}\n\nDaftar Nomor Tersimpan: \n${list}`,
    {
      reply_markup: inlineKeyboard
    })
}


function sendResultToUser(ctx, data) {
  // Ubah format hasil menjadi pesan yang dapat dikirim ke pengguna
  let message = '';
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
