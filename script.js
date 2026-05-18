import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
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
      <td>Rp ${harga}</td>
      <td>${qty}</td>
      <td>Rp ${total}</td>
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
    totalBayar;

  document.getElementById("qty").value = "";


}

window.hapusItem = function(button, total){

  totalBayar -= total;

  button.parentElement.parentElement.remove();

  document.getElementById("totalBayar").innerText =
    totalBayar;

}

async function loadRiwayat(){

  const querySnapshot =
    await getDocs(collection(db, "transaksi"));

  const riwayatBody =
    document.getElementById("riwayatBody");

  riwayatBody.innerHTML = "";

  let totalHarian = 0;
  let cash = 0;
  let debit = 0;
  let qris = 0;

  const docs = [];

  querySnapshot.forEach((doc) => {

    docs.push(doc.data());

  });

  // urut terbaru
  docs.sort((a, b) => {

    return b.createdAt.seconds -
           a.createdAt.seconds;

  });

  // tanggal hari ini
  docs.forEach((data) => {

  // total semua transaksi
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

    // daftar item
    const daftarItem = data.items
      .map(item =>
        `${item.menu} x${item.qty}`
      )
      .join("<br>");

    const row = `
      <tr>

        <td>${data.nama}</td>

        <td>${daftarItem}</td>

        <td>${data.metode}</td>

        <td>Rp ${data.total}</td>

        <td>Rp ${data.kembalian || 0}</td>

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
    "pendapatanHarian"
  ).innerText = totalHarian;

  document.getElementById(
    "totalCash"
  ).innerText = cash;

  document.getElementById(
    "totalDebit"
  ).innerText = debit;

  document.getElementById(
    "totalQris"
  ).innerText = qris;

}

loadRiwayat();

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

    alert(
      "Pembayaran berhasil!\n\n" +

      "Nama: " + nama + "\n" +
      "Metode: " + metode + "\n" +
      "Total: Rp " + totalBayar + "\n" +
      "Kembalian: Rp " + kembalian
    );

    // reset tabel
    document.getElementById("tbody").innerHTML = "";

    // reset total
    totalBayar = 0;

    document.getElementById("totalBayar").innerText =
      totalBayar;

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