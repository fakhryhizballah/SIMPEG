function QRUser(message) {
  new QRCode("qrcodeUser", {
    text: message,
    width: 90,
    height: 90,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
function QRAtasan(message) {
  let qrCodeA = new QRCodeStyling({
    width: 120,
    height: 120,
    type: "svg",
    data: message,
    image: "/asset/img/Lambang.webp",
    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },
  });
  qrCodeA.append(document.getElementById("qrcodeAtasan"));
}

let params = (new URL(document.location)).searchParams;
let date = params.get("date");
console.log(periode);


async function getQR() {
  await $.ajax({
    url: "/api/monthly/signaute?periode=" + date + "&nik=" + nik,
    method: "GET",
    success: function (response) {
      console.log(response);
      if (response.data.stausUser) {
        let message = response.data.aprovUser.user.nama + " telah membuat laporan periode " + periode + " Pada tanggal " + response.data.aprovUser.date;
        QRUser(message);
      }
      if (response.data.stausAtasan) {
        let message = response.data.aprovAtasan.atasan.nama + " telah menyetujui laporan periode " + periode + " Pada tanggal " + response.data.aprovAtasan.date;
        $("#nameAtasan").text(response.data.aprovAtasan.atasan.nama);
        $("#nipAtasan").text("NIP. " + response.data.aprovAtasan.atasan.nip);
        QRAtasan(message);
      }
    }
  });

}


$(document).ready(async function () {

  // window.onload = function () {
  //   window.print();
  // };
  getQR()
  // setTimeout(window.print(), 5000);
  setTimeout(function () {
    window.print();
  }, 3000);
  console.log("ready!");
  // 

});
