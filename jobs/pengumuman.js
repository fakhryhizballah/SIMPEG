require('dotenv').config();
const { User, Lpkp, Rekap, Notif } = require("../models");
const { Op } = require("sequelize");
const readline = require('node:readline');
const axios = require('axios');
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_MAIL;
const payload = {
    gid: "Server Side",
};

if (process.argv[4] == "cek") {
    console.log('Usage: node ' + process.argv[1] + ' STATUS PERIODE');
    process.exit(1);

}

// submit(process.argv[2], process.argv[3]);

function bulan(month) {
    // Mengubah tanggal menjadi objek Date
    const date = new Date(month);
    // Mendapatkan nama bulan dari objek Date
    const options = { month: 'long' };
    const monthName = date.toLocaleDateString('id-ID', options);
    return monthName
}

async function submit(status, tanggal, kirim) {
    let users = await User.findAll({
        where: {
            status: status
        },
        attributes: ['nik', 'nama', 'email', 'JnsKel']
    })
    console.log(tanggal)
    let rekap = await Rekap.findAll({
        where: {
            periode: {
                [Op.substring]: tanggal
            }
        }
    });
    let notifs = await Notif.findAll({
        where: {
            email: '0'
        }
    })
    
    let notif = notifs.map(x => x.user)
    let user = users.map(x => x.nik)
    let rekaps = rekap.map(x => x.nik)
    console.log(user.length)
    console.log(rekaps.length)
    let data = user.filter(x => !rekaps.includes(x))
    let data2 = data.filter(x => !notif.includes(x))

    for (let vaule of data2) {
        let index = users.findIndex(item => item.nik === vaule);
        if (index !== -1) {
            console.log(users[index].nama + ' ' + users[index].nik + ' ' + users[index].email)
            if (kirim == "kirim") {
                try {
                    await kirimEmailLaporan(users[index].nama, users[index].email, bulan(tanggal), users[index].JnsKel)
                    console.log('kirim email')
                } catch (error) {
                    console.log("error kirim email")
                }

            }
        }
    }
    console.log(`Yang belum kirim ${data2.length} orang`)


}
// submit('PPPK', '2023-08')



async function kirimEmailLaporan(nama, email, month, JnsKel) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let date = new Date().toISOString().slice(0, 10);

    let date_now = date.split('-')
    let tanggal = date_now[2] + ' ' + bulan(date_now[1]) + ' ' + date_now[0]
    let jnskel = JnsKel === 'Laki-laki' ? 'Bapak' : 'Ibu'
    let data = {
        "to": email,
        "subject": `Pemberitahuan untuk mengirim laporan kinerja bulan ${month}`,
        "template": "standar",
        "data": {
            "date_now": tanggal,
            "name": `${jnskel} ${nama}`,
            "subject": `Pemberitahuan untuk mengirim laporan kinerja bulan ${month}`,
            "p1": `Saya harap ${jnskel} ${nama} dalam keadaan sehat. Kami ingin mengingatkan ${jnskel} ${nama} untuk segera mengirimkan laporan kinerja bulan ${month}. Laporan ini sangat penting untuk memantau kemajuan pekerjaan di RSU Saadah dan untuk mencapai tujuan pelayanan yang lebih baik.`,
            "p2": `Diharapkan laporan kinerja bulan ${month} dapat segera dikrirm.
            Jika ${jnskel} ${nama} memerlukan bantuan tambahan atau ada kendala dalam menyusun laporan, jangan ragu untuk menghubungi bagian SDM.`,
            "p3": `Terima kasih atas kerja keras ${jnskel} ${nama}. Kami berharap laporan kinerja bulan ${month} dapat segera kami terima.`,
            "from": "",
            "jabatan": "RSU Saadah",
        }
    };
    let config = {
        method: "post",
        url: process.env.HOSTMAIL,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: data,
    };
    return await axios.request(config)
}
// console.log(bulan('2021-08'))
// kirimEmailLaporan('Lady Cleophila Mardhatillah', 'falehry88@gmail.com', bulan('2023-08'), 'Perempuan')

const rli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`Pengumuman Laporan Kinerja Bulanan Via Email`);
function input(prompt) {
    return new Promise((callbackFn, errorFn) => {
        rli.question(prompt, (uinput) => {
            callbackFn(uinput);
        }, () => {
            errorFn();
        });
    });
}
const main = async () => {
    let status = await input("masukan Jenis Pegawai (PNS/PPPK/Non ASN) : ");
    if (status !== 'PNS' && status !== 'PPPK' && status !== 'Non ASN') {
        console.log('Jenis Pegawai Salah');
        process.exit(1);
    }
    let periode = await input("masukan Periode Laporan (YYYY-MM) : ");
    if (periode.length !== 7) {
        console.log('Periode Laporan Salah');
        process.exit(1);
    }
    let kirim = await input("Kirim Email (y/n) : ");
    if (kirim !== 'y' && kirim !== 'n') {
        console.log('Kirim Email Salah');
        process.exit(1);
    }
    if (kirim == 'y') {
        submit(status, periode, 'kirim');
    } else {
        submit(status, periode, 'cek');
    }
    rli.close();
};

main();

// rl.question(`masukan Jenis Pegawai (PNS/PPPK/Non ASN) : `, status => {
//     console.log(`Status : ${status}!`);
//     let statuss = status;
//     let date = '';


// });
