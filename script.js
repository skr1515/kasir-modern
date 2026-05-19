if(localStorage.getItem("isLogin") !== "true"){

  window.location.href =
    "login.html";

}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDogitc,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAsF0xyzGCpmRuhKpM0nX3DUe8W68Qlsww",
  authDomain: "kasir-modern.firebaseapp.com",
  projectId: "kasir-modern",
  storageBucket: "kasir-modern.firebasestorage.app",
  messagingSenderId: "686266587352",
  appId: "1:686266587352:web:86887444cbd4917139dfad"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let totalBayar = 0;

let keranjang = [];

function formatRupiah(angka){

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR"
    }
  ).format(angka);

}

window.tambahItem = function(){

  const menu = document.getElementById("menu");

  const namaMenu =
    menu.options[menu.selectedIndex].text;

  const harga = parseInt(menu.value);

  const qty =
    parseInt(document.getElementById("qty").value);

  if(!qty || qty <= 0){
    alert("Masukkan jumlah item!");
    return;
  }

  const total = harga * qty;

  keranjang.push({
  menu: namaMenu,
  harga: harga,
  qty: qty,
  total: total
});

  totalBayar += total;

  const tbody =
   document.getElementById("tbody");

  const row = `
    <tr>
      <td>${namaMenu}</td>
      <td>${formatRupiah(harga)}</td>
      <td>${qty}</td>
      <td>${formatRupiah(total)}</td>
      <td>
        <button class="hapus"
          onclick="hapusItem(this, ${total})">
          Hapus
        </button>
      </td>
    </tr>
  `;

  tbody.innerHTML += row;

  document.getElementById("totalBayar").innerText =
  formatRupiah(totalBayar);

  document.getElementById("qty").value = "";


}

window.hapusItem = function(button, total){

  totalBayar -= total;

  button.parentElement.parentElement.remove();

  document.getElementById("totalBayar").innerText =
  formatRupiah(totalBayar);

}

window.loadRiwayat = async function(){

  const querySnapshot =
    await getDocs(collection(db, "transaksi"));

  const riwayatBody =
    document.getElementById("riwayatBody");

  riwayatBody.innerHTML = "";

let totalHarian = 0;
let totalSemua = 0;

let cash = 0;
let debit = 0;
let qris = 0;

let cashSemua = 0;
let debitSemua = 0;
let qrisSemua = 0;

// REPORT BULANAN

let totalBulanan = 0;

let cashBulanan = 0;
let debitBulanan = 0;
let qrisBulanan = 0;

  const docs = [];

  querySnapshot.forEach((doc) => {

    docs.push(doc.data());

  });

  // urut terbaru
  const sortElement =
  document.getElementById(
    "sortTanggal"
  );

const sort =
  sortElement
    ? sortElement.value
    : "terbaru";

if(sort === "terbaru"){

  docs.sort((a, b) => {

    return b.createdAt.seconds -
           a.createdAt.seconds;

  });

} else {

  docs.sort((a, b) => {

    return a.createdAt.seconds -
           b.createdAt.seconds;

  });

}

  // tanggal hari ini
  docs.forEach((data) => {

    const tanggal =
  new Date(
    data.createdAt.seconds * 1000
  );

const bulanSekarang =
  new Date().getMonth();

const tahunSekarang =
  new Date().getFullYear();

// REPORT BULANAN

if(
  tanggal.getMonth() === bulanSekarang &&
  tanggal.getFullYear() === tahunSekarang
){

  totalBulanan += data.total;

  if(data.metode === "Cash"){

    cashBulanan += data.total;

  }

  if(data.metode === "Debit"){

    debitBulanan += data.total;

  }

  if(data.metode === "QRIS"){

    qrisBulanan += data.total;

  }

}
    // total semua pendapatan
totalSemua += data.total;

if(data.metode === "Cash"){

  cashSemua += data.total;

}

if(data.metode === "Debit"){

  debitSemua += data.total;

}

if(data.metode === "QRIS"){

  qrisSemua += data.total;

}
  
    // cek tanggal hari ini

const today =
  new Date().toLocaleDateString();

const tanggalTransaksi =
  data.createdAt
    ? new Date(
        data.createdAt.seconds * 1000
      ).toLocaleDateString()
    : "";

// kalau bukan hari ini skip
if(tanggalTransaksi === today){

  totalHarian += data.total;

  if(data.metode === "Cash"){

    cash += data.total;

  }

  if(data.metode === "Debit"){

    debit += data.total;

  }

  if(data.metode === "QRIS"){

    qris += data.total;

  }

}

    // daftar item
    let daftarItem = "";

if(data.items){

  daftarItem = data.items
    .map(item =>
      `${item.menu} x${item.qty}`
    )
    .join("<br>");

} else {

  daftarItem =
    `${data.menu || "-"} x${data.qty || 1}`;

}

    const row = `
      <tr>

        <td>${data.nama}</td>

        <td>${daftarItem}</td>

        <td>${data.metode}</td>

        <td>${formatRupiah(data.total)}</td>

        <td>${formatRupiah(data.kembalian || 0)}</td>

        <td>
          ${data.createdAt
            ? new Date(
                data.createdAt.seconds * 1000
              ).toLocaleString()
            : "-"}
        </td>

      </tr>
    `;

    riwayatBody.innerHTML += row;

  });

  // tampilkan reporting realtime

document.getElementById(
  "totalSemua"
).innerText =
  formatRupiah(totalSemua);

document.getElementById(
  "cashSemua"
).innerText =
  formatRupiah(cashSemua);

document.getElementById(
  "debitSemua"
).innerText =
  formatRupiah(debitSemua);

document.getElementById(
  "qrisSemua"
).innerText =
  formatRupiah(qrisSemua);

document.getElementById(
  "pendapatanHarian"
).innerText =
  formatRupiah(totalHarian);

document.getElementById(
  "cashHarian"
).innerText =
  formatRupiah(cash);

document.getElementById(
  "debitHarian"
).innerText =
  formatRupiah(debit);

document.getElementById(
  "qrisHarian"
).innerText =
  formatRupiah(qris);

// REPORT BULANAN

document.getElementById(
  "totalBulanan"
).innerText =
  formatRupiah(totalBulanan);

document.getElementById(
  "cashBulanan"
).innerText =
  formatRupiah(cashBulanan);

document.getElementById(
  "debitBulanan"
).innerText =
  formatRupiah(debitBulanan);

document.getElementById(
  "qrisBulanan"
).innerText =
  formatRupiah(qrisBulanan);
}

loadRiwayat();
loadProduk();

window.toggleRiwayat = function(){

  const riwayat =
    document.getElementById("riwayatContainer");

  if(riwayat.style.display === "none"){

    riwayat.style.display = "block";

  } else {

    riwayat.style.display = "none";

  }

}

window.bayarSekarang = async function(){

  const nama =
    document.getElementById("namaPemesan").value;

  const metode =
    document.getElementById("metodeBayar").value;

  const uangBayar =
    parseInt(
      document.getElementById("uangBayar").value
    );

  if(!nama){

    alert("Masukkan nama pemesan!");

    return;

  }

  if(totalBayar <= 0){

    alert("Belum ada transaksi!");

    return;

  }

  let kembalian = 0;

  // kalau cash wajib isi uang
  if(metode === "Cash"){

    if(!uangBayar || uangBayar < totalBayar){

      alert("Uang customer kurang!");

      return;

    }

    kembalian = uangBayar - totalBayar;

  }

  try{

    await addDoc(collection(db, "transaksi"), {

      nama: nama,
      metode: metode,
      bayar: uangBayar || totalBayar,
      kembalian: kembalian,
      items: keranjang,
      total: totalBayar,
      createdAt: new Date()

    });

   // daftar item struk
let daftarStruk = "";

keranjang.forEach((item) => {

  daftarStruk +=
    item.menu +
    " x" + item.qty +
    " = " +
    formatRupiah(item.total) +
    "<br>";

});

// popup struk
const struk = `
  <div
    style="
      font-family: monospace;
      padding:20px;
    "
  >

    <h2 style="text-align:center;">
      🌿 Cafe Rindu
    </h2>

    <hr>

    <p>
      Nama: ${nama}
    </p>

    <p>
      Metode: ${metode}
    </p>

    <hr>

    ${daftarStruk}

    <hr>

    <p>
      Total:
      ${formatRupiah(totalBayar)}
    </p>

    <p>
      Bayar:
      ${formatRupiah(
        uangBayar || totalBayar
      )}
    </p>

    <p>
      Kembalian:
      ${formatRupiah(kembalian)}
    </p>

    <hr>

    <p style="text-align:center;">
      Terima Kasih ☕
    </p>

  </div>
`;

// buka window print
const win = window.open(
  "",
  "",
  "width=400,height=600"
);

win.document.write(struk);

win.document.close();

win.print();

    // reset tabel
    document.getElementById("tbody").innerHTML = "";

    // reset total
    totalBayar = 0;

    document.getElementById("totalBayar").innerText =
  formatRupiah(totalBayar);

    // reset input
    document.getElementById("namaPemesan").value = "";

    document.getElementById("uangBayar").value = "";

    // reset keranjang
    keranjang = [];

    loadRiwayat();

  } catch(error){

    console.error(error);

  }

}

window.logout = function(){

  localStorage.removeItem("isLogin");

  window.location.href =
    "login.html";

}

document.getElementById(
  "userLogin"
).innerText =

  "👋 Halo, " +

  localStorage.getItem("username");

  window.toggleReport = function(){

  const report =
    document.getElementById(
      "reportContainer"
    );

  if(report.style.display === "none"){

    report.style.display = "block";

  } else {

    report.style.display = "none";

  }

}

window.showHarian = function(){

  document.getElementById(
    "reportHarian"
  ).style.display = "grid";

  document.getElementById(
    "reportBulanan"
  ).style.display = "none";

}

window.showBulanan = function(){

  document.getElementById(
    "reportHarian"
  ).style.display = "none";

  document.getElementById(
    "reportBulanan"
  ).style.display = "grid";

}

window.tambahProduk = async function(){

  const nama =
    document.getElementById(
      "namaProduk"
    ).value;

  const harga =
    parseInt(
      document.getElementById(
        "hargaProduk"
      ).value
    );

  if(!nama || !harga){

    alert("Isi produk!");

    return;

  }

  try{

    await addDoc(
      collection(db, "produk"),
      {

        nama: nama,
        harga: harga

      }
    );

    alert("Produk berhasil ditambah");

    document.getElementById(
      "namaProduk"
    ).value = "";

    document.getElementById(
      "hargaProduk"
    ).value = "";

    loadProduk();

  } catch(error){

    console.error(error);

  }

}

window.loadProduk = async function(){

  const querySnapshot =
    await getDocs(
      collection(db, "produk")
    );

  const produkBody =
    document.getElementById(
      "produkBody"
    );

  const menu =
    document.getElementById(
      "menu"
    );

  produkBody.innerHTML = "";

  menu.innerHTML = "";

  querySnapshot.forEach((docSnap) => {

    const data = docSnap.data();

    // dropdown kasir
    menu.innerHTML += `

      <option value="${data.harga}">

        ${data.nama} -
        ${data.harga}

      </option>

    `;

    // tabel produk
    produkBody.innerHTML += `

      <tr>

        <td>${data.nama}</td>

        <td>
          ${formatRupiah(data.harga)}
        </td>

        <td>

          <button
            onclick="editProduk(
              '${docSnap.id}',
              '${data.nama}',
              '${data.harga}'
            )"
          >

            Edit

          </button>

          <button
            onclick="hapusProduk(
              '${docSnap.id}'
            )"
          >

            Hapus

          </button>

        </td>

      </tr>

    `;

  });

}

window.editProduk = async function(
  id,
  namaLama,
  hargaLama
){

  const namaBaru =
    prompt(
      "Edit Nama Produk",
      namaLama
    );

  const hargaBaru =
    prompt(
      "Edit Harga",
      hargaLama
    );

  if(!namaBaru || !hargaBaru){

    return;

  }

  try{

    await updateDoc(
      doc(db, "produk", id),
      {

        nama: namaBaru,
        harga: parseInt(hargaBaru)

      }
    );

    alert("Produk berhasil diupdate");

    loadProduk();

  } catch(error){

    console.error(error);

  }

}

window.hapusProduk = async function(id){

  const yakin =
    confirm(
      "Hapus produk ini?"
    );

  if(!yakin){

    return;

  }

  try{

    await deleteDoc(
      doc(db, "produk", id)
    );

    alert("Produk dihapus");

    loadProduk();

  } catch(error){

    console.error(error);

  }

}