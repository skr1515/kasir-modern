window.login = function(){

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  // akun admin
  if(
    username === "admin" &&
    password === "12345"
  ){

    localStorage.setItem(
      "isLogin",
      "true"
    );

    window.location.href =
      "index.html";

  } else {

    alert(
      "Username atau password salah!"
    );

  }

}