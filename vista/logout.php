<?php

  if(isset($_GET['close']) && $_GET['close']=="yes"){
    setcookie("iduser", null, time() - 3600, "/");
    setcookie("user", null, time() - 3600, "/");
    setcookie("nivel_adm", null, time() - 3600, "/");
    setcookie("correo", null, time() - 3600, "/");
    setcookie("ID_EMPRESA", null, time() - 3600, "/");
    setcookie("idruta", null, time() - 3600, "/");
    header("Location: login.php");
  }else{
  	header("Location: prestamos.php");
  }

 ?>
