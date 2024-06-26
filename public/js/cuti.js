
let hariKerja = '';
$.ajax({
    url: '/api/getBiodata',
    method: 'GET',
    success: function (response) {
        hariKerja = response.data.jns_kerja;
    },
    error: function (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Lengkapi biodata anda terlebih dahulu',
            toast: true,
            confirmButtonText: "OK",
            // showCancelButton: true,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false, // Tidak memungkinkan untuk mengklik luar jendela SweetAlert
            allowEscapeKey: false,   // Tidak memungkinkan untuk menutup dengan tombol "Esc"
            allowEnterKey: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/profile';
            }
        });
    }
});

let totalCuti = 0;
let maxCuti = 0;
let dataCuti = [];
let mulaicuti = '';
let akhircuti = '';

$.ajax({
    url: '/api/cuti/jns',
    method: 'GET',
    success: function (response) {
        dataCuti = response.data;
        // change select option jnscuti type_cuti
        response.data.forEach(element => {
            $('#jnsCuti').append(`<option value="${element.id}">${element.type_cuti}</option>`);
        });
    },
    error: function (error) {
    }
});
$('#jnsCuti').change(function () {
    // enable reservation
    $('#reservation').prop('disabled', false);
    let id = $(this).val();
    let jnsCuti = dataCuti.find(x => x.id == id);
    $('#Keterangan_cuti').text(jnsCuti.type_cuti + ' maksimal ' + jnsCuti.max + ' hari secara berturut-turut dan maksimal ' + jnsCuti.total + ' hari dalam setahun.');
    $('#reservation').val('');
    $('#totalReservation').val('');
    let mindate
    if (jnsCuti.type_cuti == "Cuti Sakit") {
        mindate = moment().clone().startOf('week')
    } else {
        mindate = moment().startOf('day')
    }
    $('#reservation').daterangepicker({
        // opens: 'left',
        minDate: mindate,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end) {
        // Tanggal awal
        mulaicuti = start.format('YYYY-MM-DD');
        const tanggalAwal = moment(start, 'YYYY-MM-DD');
        // Tanggal akhir
        akhircuti = end.format('YYYY-MM-DD');
        const tanggalAkhir = moment(end, 'YYYY-MM-DD');

        // Menghitung perbedaan hari
        const selisihHari = tanggalAkhir.diff(tanggalAwal, 'days') + 1;
        if (selisihHari > jnsCuti.max) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Cuti tidak boleh lebih dari ${jnsCuti.max} hari`,
            })
            $('#reservation').val('');
            $('#totalReservation').val('');
            return false;
        }
        if (hariKerja == "5 Hari kerja") {
            $('#totalReservation').prop('disabled', false);
        }
        $('#totalReservation').val(selisihHari);
    });
});

// on button submit 
$('#Cuti').submit(function (event) {
    event.preventDefault();
    let datafrom = {
        type_cuti: $('#jnsCuti').val(),
        mulai: mulaicuti,
        samapi: akhircuti,
        jumlah: $('#totalReservation').val(),
        keterangan: $('#alasanCuti').val(),
        maxCuti: maxCuti,
        alamat: $('#alamat').val()
    };
    $('#btnSubmit').prop('disabled', true);
    $.ajax({
        url: '/api/cuti',
        method: 'POST',
        data: datafrom,
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
                text: 'Cuti berhasil disimpan',
                showConfirmButton: false,
                timer: 2000
            })
            // $('#jnsCuti').val('');
            $('#reservation').val('');
            $('#totalReservation').val('');
            $('#reservation').prop('disabled', false);
            $('#totalReservation').prop('disabled', false);
            $('#alasanCuti').val('');
            $('#alamat').val('');
            let tahun = $('#tahun').val();
            getRiwayatCuti(tahun);
            $('#btnSubmit').prop('disabled', false);
        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                icon: error.responseJSON.icon,
                title: error.responseJSON.message,
                text: error.responseJSON.data,
                showConfirmButton: false,
                timer: 2000
            });
            $('#btnSubmit').prop('disabled', false);
        }
    });
});


$(document).ready(function () {
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
});
$('#tahun').change(function () {
    let tahun = $(this).val();
    let rows = $("tbody > tr");
    rows.remove();
    getRiwayatCuti(tahun);
});
async function getRiwayatCuti(tahun) {
    let data = await $.ajax({
        url: '/api/cuti/riwayat?tahun=' + tahun,
        method: 'GET',
        success: function (response) {
            parsingDataCuti(response.data);
            return response.data;
        },
        error: function (error) {
            console.log(error);
        }
    });
    return data;
}
function parsingDataCuti(data) {
    let rows = $("tbody > tr");
    rows.remove();
    for (let i of data) {
        let nomor = data.indexOf(i) + 1;
        let tmulai = i.mulai.split("-");
        let tanggalmulai = tmulai[2] + "/" + tmulai[1] + "/" + tmulai[0];
        let tsampai = i.samapi.split("-");
        let tanggalsampai = tsampai[2] + "/" + tsampai[1] + "/" + tsampai[0];

        let row = $("<tr>");
        row.append($("<td>" + nomor + "</td>"));
        row.append($("<td>" + tanggalmulai + " - " + tanggalsampai + "</td>"));
        row.append($("<td>" + i.jenis_cuti.type_cuti + "</td>"));
        row.append($("<td>" + i.jumlah + "</td>"));
        row.append($("<td>" + i.keterangan + "</td>"));
        row.append($("<td>" + i.approval.status + "</td>"));
        row.append($("<td>" + i.approval.approve_date + "</td>"));
        row.append($("<td>" + i.approval.user.nama + "</td>"));
        row.append($("<td>" + i.approval.keterangan + "</td>"));
        // tabah tombol edit dan delete
        let btnDelete = $("<button>");
        btnDelete.addClass("btn btn-danger btn-sm");
        btnDelete.attr("onclick", "deleteCuti(" + i.id + ")");
        btnDelete.html("<i class='fas fa-trash'></i>");
        let btnCetak = $("<button>");
        btnCetak.addClass("btn btn-primary btn-sm");
        btnCetak.attr("onclick", "cetakSuratCuti(" + i.id + ")");
        btnCetak.html("<i class='fa-solid fa-envelope-open-text'></i> Cetak Surat Cuti");
        if (i.approval.status == "Menunggu") {
            row.append($("<td>").append(btnDelete));
        } else if (i.approval.status == "Disetujui") {
            row.append($("<td>").append(btnCetak));
        }
        $("tbody").append(row);
    }
}
cetakSuratCuti = (id) => {
    let data = $.ajax({
        url: '/api/cuti/suratCuti',
        method: 'POST',
        data: { id: id },
        success: function (response) {
            window.open('/api/cuti/suratCuti?token=' + response.data, '_blank');
            // return response;
        },
    });


}

deleteCuti = (id) => {
    Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Data cuti akan dihapus",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, hapus data!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/cuti?id=' + id,
                method: 'DELETE',
                success: function (response) {
                    console.log(response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Succeed',
                        text: 'Data berhasil dihapus',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    let tahun = $('#tahun').val();
                    getRiwayatCuti(tahun);
                },
                error: function (error) {
                    Swal.fire({
                        icon: error.responseJSON.icon,
                        title: error.responseJSON.message,
                        text: error.responseJSON.data,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        }
    })

}