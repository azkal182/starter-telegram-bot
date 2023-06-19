const data = [
  [
    {
    "packages": {
      "name": "Bonus Kuota Lifestyle 3GB",
      "expDate": "2023-06-26 23:59:59"
    },
    "benefits": [{
      "type": "DATA",
      "bname": "TikTok",
      "quota": "1 GB",
      "remaining": "976.28 MB"
    },
      {
        "type": "DATA",
        "bname": "Instagram",
        "quota": "1 GB",
        "remaining": "370.82 MB"
      },
      {
        "type": "DATA",
        "bname": "Spotify",
        "quota": "1 GB",
        "remaining": "592.29 MB"
      }]
  }
  ],
  [{
    "packages": {
      "name": "Xtra Combo Plus 10GB Disc 55%",
      "expDate": "2023-06-26 23:59:59"
    },
    "benefits": [{
      "type": "VOICE",
      "bname": "Nelp (ke XL/Non-XL)",
      "quota": "20 Minutes",
      "remaining": "20 Minutes"
    },
      {
        "type": "DATA",
        "bname": "Unlimited WhatsApp",
        "quota": "500 MB",
        "remaining": "353.55 MB"
      },
      {
        "type": "DATA",
        "bname": "24jam di semua jaringan - Area",
        "quota": "6 GB",
        "remaining": "258 MB"
      },
      {
        "type": "DATA",
        "bname": "24jam di semua jaringan - Area",
        "quota": "3 GB",
        "remaining": "3 GB"
      },
      {
        "type": "DATA",
        "bname": "24jam di semua jaringan",
        "quota": "10 GB",
        "remaining": "10 GB"
      },
      {
        "type": "DATA",
        "bname": "24jam di semua jaringan - Area",
        "quota": "10 GB",
        "remaining": "0"
      }]
  }],
  [{
    "packages": {
      "name": "Bonus Kuota Harian",
      "expDate": "2026-02-03 23:59:59"
    },
    "benefits": [{
      "type": "DATA",
      "bname": "Facebook WhatsApp LINE",
      "quota": "100 MB",
      "remaining": "100 MB"
    },
      {
        "type": "DATA",
        "bname": "Meeting dan Belajar Online",
        "quota": "700 MB",
        "remaining": "700 MB"
      },
      {
        "type": "DATA",
        "bname": "Grab dan Gojek",
        "quota": "100 MB",
        "remaining": "100 MB"
      },
      {
        "type": "DATA",
        "bname": "Google Maps",
        "quota": "100 MB",
        "remaining": "100 MB"
      }]
  }]
]

let totalQuota = 0;
let totalRemaining = 0;

// Mengiterasi setiap paket dan manfaatnya
data.forEach((packageInfo) => {
  packageInfo.forEach((benefit) => {
    benefit.benefits.forEach((item) => {
      if (item.type === "DATA") {
        // Mengonversi kuota ke dalam GB
        const quota = convertToGB(item.quota);
        totalQuota += quota;

        // Mengonversi kuota tersisa ke dalam GB
        const remaining = convertToGB(item.remaining);
        console.log(remaining)
        totalRemaining += remaining;
      }
    });
  });
});

// Menghitung persentase kuota yang tersisa
const percentageRemaining = (totalRemaining / totalQuota) * 100;

// Menampilkan hasil
console.log(`Total Kuota: ${totalQuota.toFixed(2)} GB`);
console.log(`Total Kuota Tersisa: ${totalRemaining.toFixed(2)} GB`);
console.log(`Persentase Kuota Tersisa: ${percentageRemaining.toFixed(2)}%`);

// Fungsi untuk mengonversi kuota ke dalam GB
function convertToGB(quota) {
  if (quota.includes("GB")) {
    return parseFloat(quota.split(" ")[0]);
  } else if (quota.includes("MB")) {
    return parseFloat(quota.split(" ")[0]) / 1024;
  } else {
    return parseFloat(quota)
  }
}