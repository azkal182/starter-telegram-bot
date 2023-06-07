const Redis = require('ioredis');

// Membuat koneksi Redis


// Fungsi untuk menambahkan data ke dalam array
async function addData(userId, newData) {
  const redis = new Redis("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");

  try {
    const key = `data_${userId}`;
    const currentData = await redis.get(key);
    let parsedData = [];

    if (currentData) {
      parsedData = JSON.parse(currentData);
    }

    parsedData.push(newData);

    await redis.set(key, JSON.stringify(parsedData));
    console.log('Data added successfully');
  } catch (error) {
    console.error('Failed to add data:', error);
  } finally {
    redis.quit(); // Menutup koneksi Redis
  }
}

// Fungsi untuk menghapus data dari array berdasarkan index
async function removeData(userId, index) {
  const redis = new Redis("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");

try {
    const key = `data_${userId}`;
    const currentData = await redis.get(key);
    let parsedData = [];

    if (currentData) {
      parsedData = JSON.parse(currentData);
    }

    parsedData.splice(index, 1);

    await redis.set(key, JSON.stringify(parsedData));
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Failed to remove data:', error);
  } finally {
    redis.quit(); // Menutup koneksi Redis
  }
}


async function readData(userId) {
  const redis = new Redis("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");

  try {
    const key = `data_${userId}`;
    const currentData = await redis.get(key);

    if (currentData) {
      const parsedData = JSON.parse(currentData);
      console.log(parsedData);
    } else {
      console.log('No data found');
    }
  } catch (error) {
    console.error('Failed to read data:', error);
  } finally {
    redis.quit(); // Menutup koneksi Redis
  }
}

// Contoh penggunaan
const userId = '404000198';

// Menambahkan data baru
//addData(userId, { name: 'arif', phone: '65444333' })


readData(userId)

// Menghapus data pada index tertentu (misalnya index ke-0)

//removeData(userId, '1')
