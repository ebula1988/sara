<?php
  if(isset($_COOKIE['user'])){
    header("Location: prestamos.php");
  }
?>
<!DOCTYPE html>
<html>
<head>
  <title>Iniciar Sesion</title>
      <!-- Font Awesome -->
    <link rel="stylesheet" href="../public/css/font-awesome.css">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Bootstrap 3.3.5 -->
    <link rel="stylesheet" href="../public/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/stilos-login.css">
    <link rel="stylesheet" href="css/sweetalert2.min.css">
</head>
  <body class="text-center">

    <div class="body-login">
      <div class="box-signin">
        <form class="form-signin" id="formularioLogin" onsubmit="return false">
          <img class="mb-4 img-circle" src="img/logo.jpg" alt="" width="92" height="92">
          <h1 class="h3 mb-3 font-weight-normal">Ingrese sus datos de Acceso</h1>
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="text" id="user" class="form-control" placeholder="Usuario" name="user" required autofocus>
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="pass" class="form-control" id="pass" name="pass" placeholder="Password" required>

          <button class="btn btn-lg btn-primary btn-block" id="btnLogin" type="submit" onclick="login_ajax(user.value,pass.value);">Entrar</button>
          <p class="mt-5 mb-3 text-muted">&copy; SARA 2019 Todos los Derechos Reservados</p>
        </form>      
      </div>      
    </div>

    <script src="scripts/sweetalert2.min.js"></script>
    <!-- jQuery -->
    <script src="../public/js/jquery-3.1.1.min.js"></script>
    <script src="https://unpkg.com/dexie@latest/dist/dexie.js"></script>
    <script type="text/javascript" src="scripts/login.js"></script>


  </body>
</html>