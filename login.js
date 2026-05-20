window.login = function(){

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  // ADMIN
  if(
    username === "admin" &&
    password === "admin123"
  ){

    localStorage.setItem(
      "isLogin",
      "true"
    );

    localStorage.setItem(
      "role",
      "admin"
    );

    localStorage.setItem(
      "username",
      username
    );

    window.location.href =
      "index.html";

    return;

  }

  // KASIR
  if(
    username === "kasir" &&
    password === "kasir123"
  ){

    localStorage.setItem(
      "isLogin",
      "true"
    );

    localStorage.setItem(
      "role",
      "kasir"
    );

    localStorage.setItem(
      "username",
      username
    );

    window.location.href =
      "index.html";

    return;

  }

  alert("Username atau password salah!");

}