const phoneNumber = '6287891276651';

// Menghapus spasi dan karakter khusus dari nomor telepon
const formattedPhoneNumber = phoneNumber.replace(/[^\d]/g, '');

console.log(formattedPhoneNumber);
