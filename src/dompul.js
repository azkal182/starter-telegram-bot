//const fetch = require('node-fetch');
const fs = require('fs');

const login_email = 'mohazkalarif96@gmail.com';
const file_output = './xl.json';

async function login() {
  console.log(`Login ${login_email}...`);
  const response = await fetch('https://srg-txl-login-controller-service.ext.dp.xl.co.id/v2/auth/email/' + login_email, {
    method: 'POST',
    headers: {
      'x-dynatrace': 'MT_3_2_763403741_15-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_30_456_73',
      'accept': 'application/json',
      'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
      'language': 'en',
      'version': '4.1.2',
      'user-agent': 'okhttp/3.12.1'
    },
    body: ''
  });
  const data = await response.json();
  const statusCode = data.statusCode;
  if (statusCode === 200) {
    console.log('OTP Sent...');
  } else {
    const statusDescription = data.statusDescription;
    console.log(`[${statusCode}] ${statusDescription}`);
    process.exit(100);
  }
}

async function send_otp() {
  const otp = await getInput('Insert OTP: ');
  const response = await fetch(`https://srg-txl-login-controller-service.ext.dp.xl.co.id/v2/auth/email/${login_email}/${otp}/000000000000000`, {
    method: 'GET',
    headers: {
      'x-dynatrace': 'MT_3_2_763403741_15-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_30_456_73',
      'accept': 'application/json',
      'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
      'language': 'en',
      'version': '4.1.2',
      'user-agent': 'okhttp/3.12.1'
    }
  });
  const data = await response.json();
  const statusCode = data.statusCode;
  if (statusCode === 200) {
    const accessToken = data.result.data.accessToken;
    const refreshToken = data.result.data.refreshToken;
    const tokenData = {
      emailToken: login_email,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    fs.writeFileSync('./xl.token', JSON.stringify(tokenData));
    console.log('OTP Verified...');
    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);
  } else {
    const statusDescription = data.statusDescription;
    console.log(`[${statusCode}] ${statusDescription}`);
    process.exit(100);
  }
}

function getInput(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function refresh_token() {
  if (fs.existsSync('./xl.token')) {
    const tokenData = JSON.parse(fs.readFileSync('./xl.token'));
    const emailToken = tokenData.emailToken;
    if (login_email === emailToken) {
      console.log('Refreshing token...');
      const refreshToken = tokenData.refreshToken;
      const response = await fetch('https://srg-txl-login-controller-service.ext.dp.xl.co.id/v1/login/token/refresh', {
        method: 'POST',
        headers: {
          'x-dynatrace': 'MT_3_3_763403741_21-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_0_209_44',
          'accept': 'application/json',
          'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
          'language': 'en',
          'version': '4.1.2',
          'content-type': 'application/x-www-form-urlencoded',
          'user-agent': 'okhttp/3.12.1'
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&imei=000000000000000`
      });
      const data = await response.json();
      const statusCode = data.statusCode;
      if (statusCode === 200) {
        const accessToken = data.result.accessToken;
        const refreshToken = data.result.refreshToken;
        const newTokenData = {
          emailToken: login_email,
          accessToken: accessToken,
          refreshToken: refreshToken
        };
        fs.writeFileSync('./xl.token', JSON.stringify(newTokenData));
        console.log('Token refreshed');
      } else {
        console.log('Failed to refresh the token');
        const statusDescription = data.statusDescription;
        console.log(`[${statusCode}] ${statusDescription}`);
        await login();
        await send_otp();
      }
    } else {
      await login();
      await send_otp();
    }
  } else {
    await login();
    await send_otp();
  }
}
async function cek_kuota_data(nomer) {
 let nomer_hp = nomer
if (nomer.startsWith("62")) {
    // Nomor telepon sudah dalam format internasional, tidak perlu diubah
    nomer_hp = nomer
  } else if (input.startsWith("08")) {
    // Ubah nomor telepon dari format lokal ke format internasional
    nomer_hp =  nomer.replace(/^08/, "62");
  } else {
    console.log('nomor hp tidak valid')
    nomer_hp = nomor 
  }
 console.log(`Cek kuota ${nomer_hp}...`);
 const tokenData = JSON.parse(fs.readFileSync('./xl.token'));
 const accessToken = tokenData.accessToken;
  const response = await fetch(`https://srg-txl-utility-service.ext.dp.xl.co.id/v2/package/check/${nomer_hp}`, {
    method: 'GET',
    headers: {
      'x-dynatrace': 'MT_3_1_763403741_16-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_0_396_167',
      'accept': 'application/json',
      'authorization': `Bearer ${accessToken}`,
      'language': 'en',
      'version': '4.1.2',
      'user-agent': 'okhttp/3.12.1'
    }
  });
  const data = await response.json();
  const statusCode = data.statusCode;
  if (statusCode === 200) {
    const packageData = data.result.data;
    //const formattedData = packageData.map(item => `${item.NAME}: ${item.VALUE}`).join('\n').replace(/NAME/g, '\nNAME') + '\n\n=====PRESS "q" TO EXIT=====';
  //  console.log(JSON.stringify(packageData));
    return packageData
  } else {
    const statusDescription = data.statusDescription;
    const errorMessage = data.result.errorMessage;
    console.log(`[${statusCode}] ${statusDescription}`);
    console.log(errorMessage);
    return errorMessage
    //process.exit(100);
  }
}

async function getData(number) {
  /*
refresh_token().then(()=> {
  return cek_kuota_data(number)
  }).catch((err)=>{
  console.log('error refresh token : ' + err)
})
*/
try {
  await refresh_token()
  
  try{
   return await cek_kuota_data(number)
    }catch(err){console.log('error cek kuota : ' + err)}
  
}catch(err){console.log('error refresh token : ' + err)}
}
module.exports = getData;
//const test = getData('6287891276651')

//console.log(test)
/*

login()
  .then(() => send_otp())
  .catch

*/