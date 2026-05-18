import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
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

window.tambahItem = async function(){

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

  totalBayar += total;

  const tbody = document.getElementById("tbody");

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

  // SIMPAN KE FIREBASE
  try {

    await addDoc(collection(db, "transaksi"), {

      menu: namaMenu,
      harga: harga,
      qty: qty,
      total: total,
      createdAt: new Date()

    });

    console.log("Transaksi berhasil disimpan");

  } catch(error){

    console.error(error);

  }

}

window.hapusItem = function(button, total){

  totalBayar -= total;

  button.parentElement.parentElement.remove();

  document.getElementById("totalBayar").innerText =
    totalBayar;

}