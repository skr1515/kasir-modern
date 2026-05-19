window.login = function(){

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  // akun admin
  const akun = [

  {
    username: "admin",
    password: "12345"
  },

  {
    username: "kasir1",
    password: "11111"
  },

  {
    username: "kasir2",
    password: "22222"
  }

];

window.login = function(){

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  // cek akun
  const user = akun.find((a) => {

    return (
      a.username === username &&
      a.password === password
    );

  });

  if(user){

    // simpan status login
    localStorage.setItem(
      "isLogin",
      "true"
    );

    // simpan username login
    localStorage.setItem(
      "username",
      user.username
    );

    window.location.href =
      "index.html";

  } else {

    alert(
      "Username atau password salah!"
    );

  }

}

}