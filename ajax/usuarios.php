<?php 
require_once "../modelos/usuarios.php";



  $str = $_POST['r'];
  if(!isset($str)) $str=$_GET['r'];
  $usuario = new Usuarios();

  switch ($str) {

    case 'filtrarMontoPrestado':  
      $desde   = $_POST['desde'];
      $hasta    = $_POST['hasta']; 
      $valor   =  $usuario->filtrarMontoPrestado($desde,$hasta);
      echo json_encode($valor);
    break;
    case 'filtrarMontoCobrado': 

      if(!isset($_COOKIE['status']))
      {
        $valor["disconnect"] = true;
        echo json_encode($valor);
      }else{
        $desde   = $_POST['desde'];
        $hasta    = $_POST['hasta'];
        $valor   =  $usuario->filtrarMontoCobrado($desde,$hasta); 
        echo json_encode($valor);
      }
      
    break;
     case 'filtrarMontoXCobrar': 
      $desde   = $_POST['desde'];
      $hasta    = $_POST['hasta'];
      $valor   =  $usuario->filtrarMontoXCobrar($desde,$hasta); 
      echo json_encode($valor);
    break; 
    case 'loguear':
      $user   = $_POST['user'];
      $pass    = $_POST['pass'];
      $array   = ["estatus" => false];
      $valor   =  json_decode($usuario->loguear($user,$pass));
      if(!$valor->existe){
        $array["error"] = $valor->mensaje;
        $array["rows"] = $valor->rows;
      }
      else{

        //$_SESSION['user'] =  $valor->usuario;
        //$_SESSION['iduser'] =  $valor->id;
        //$_SESSION['nivel_adm'] =  $valor->nivel_adm;
        //$_SESSION['correo'] =  $valor->correo;
        //$_SESSION['ID_EMPRESA'] =  $valor->ID_EMPRESA;
        //$_SESSION['idruta'] =  $valor->ID_RUTA;
        $un_dia = 86400;
        setcookie('user', $valor->usuario, time() + ($un_dia * 30), "/");
        setcookie('iduser', $valor->id, time() + ($un_dia * 30), "/");
        setcookie('nivel_adm', $valor->nivel_adm, time() + ($un_dia * 30), "/");
        setcookie('correo', $valor->correo, time() + ($un_dia * 30), "/");
        setcookie('ID_EMPRESA', $valor->ID_EMPRESA, time() + ($un_dia * 30), "/");
        setcookie('idruta', $valor->ID_RUTA, time() + ($un_dia * 30), "/");
        setcookie('status', $valor->status, time() + ($un_dia * 30), "/");
        $array["estatus"] = true;
      }
      return print(json_encode($array));
      break;

      case 'cargarMontoCobrado':

      break;

      case 'listar_usuarios':
        $rspta=$usuario->listar();
        //Vamos a declarar un array
        $data= Array();

        while ($reg=$rspta->fetch_object()){
          if($_COOKIE["nivel_adm"]==0){
            //mdoerador
            $data[]=array(
            
            "0"=>$reg->usuario,
            "1"=>$reg->correo,
            "2"=>$reg->nivel_adm,
            "3"=>$reg->fecha,
            "4"=>($reg->status)?'<span class="bg-green">Activado</span>':
            '<span class="bg-red">Desactivado</span>',
            "5"=>'Sin Opciones'
            );
          }else{
            //administrador
            $data[]=array(
            
            "0"=>$reg->usuario,
            "1"=>$reg->correo,
            "2"=>$reg->nivel_adm,
            "3"=>$reg->fecha,
            "4"=>($reg->status)?'<span class="bg-green">Activado</span>':
            '<span class="bg-red">Desactivado</span>',
            "5"=>($reg->status==1)?'<button class="btn btn-warning" onclick="mostrar('.$reg->ID.')"><i class="fa fa-pencil"></i></button>'.
              ' <button class="btn btn-danger" onclick="desactivar('.$reg->ID.')"><i class="fa fa-close"></i></button>':
              '<button class="btn btn-warning" onclick="mostrar('.$reg->ID.')"><i class="fa fa-pencil"></i></button>'.
              ' <button class="btn btn-primary" onclick="activar('.$reg->ID.')"><i class="fa fa-check"></i></button>'
            );
          }
          
        }
        $results = array(
          "sEcho"=>1, //Información para el datatables
          "iTotalRecords"=>count($data), //enviamos el total registros al datatable
          "iTotalDisplayRecords"=>count($data), //enviamos el total registros a visualizar
          "aaData"=>$data);
        return print(json_encode($results));
      break;
      case 'guardaryeditar':
        $idusuario=isset($_POST["idusuario"])? limpiarCadena($_POST["idusuario"]):"";
        $user=isset($_POST["usuario"])? limpiarCadena($_POST["usuario"]):"";
        $clave=isset($_POST["clave"])? limpiarCadena($_POST["clave"]):"";

        $correo=isset($_POST["correo"])? limpiarCadena($_POST["correo"]):"";
        $id_nivel_adm=isset($_POST["id_nivel_adm"])? limpiarCadena($_POST["id_nivel_adm"]):"";
        $idruta=isset($_POST["idruta"])? limpiarCadena($_POST["idruta"]):"";
        if (empty($idusuario)){
          $valor = $usuario->verificarSiExisteUsuario($user,0);
          $valor2 = $usuario->verificarSiExisteCorreo($correo,0); 
          $array   = ["existe" => false];
          if($valor || $valor2){
            $array["existe"] = true;
            $array["mensaje"] = "El usuario o correo ya existen";
          }else{
            $salt = '$6$rounds=5000$ebulapassword$';
            $hashed_password = crypt($clave,$salt);
            $rspta=$usuario->insertar($user,$hashed_password,$correo,$id_nivel_adm,$idruta);
            if($rspta){
              $array["mensaje"] = "Usuario registrado exitosamente";
            }else{
              $array["mensaje"] = "El usuario no se pudo registrar";
            }
          }
          return print(json_encode($array));
        }
        else {
          $valor = $usuario->verificarSiExisteUsuario($user,$idusuario);
          $valor2 = $usuario->verificarSiExisteCorreo($correo,$idusuario); 
          $array   = ["existe" => false];
          if($valor || $valor2){
              $array["existe"] = true;
              $array["mensaje"] = "El usuario o correo ya existen";
            }else{
              $rspta=$usuario->editar($idusuario,$user,$correo,$id_nivel_adm,$idruta);
              if($rspta){
                $array["mensaje"] = "Usuario actualizado exitosamente";
              }else{
                $array["mensaje"] = "El usuario no se pudo actualizar";
              }
            }
         /* 
          echo $rspta ? "Cliente actualizado" : "Cliente no se pudo actualizar";*/
          return print(json_encode($array));
        }
      break;

      case 'guardarclave':
      $idusuarioclave=isset($_POST["idusuarioclave"])? limpiarCadena($_POST["idusuarioclave"]):"";
      $clave=isset($_POST["guardar_clave"])? limpiarCadena($_POST["guardar_clave"]):"";
      $salt = '$6$rounds=5000$ebulapassword$';
      $hashed_password = crypt($clave,$salt);
      $rspta=$usuario->editarClave($idusuarioclave,$hashed_password);
      $array   = ["status" => false];
      if($rspta){
         $array["mensaje"] = "Clave actualizada exitosamente";
         $array["status"] = true;
      }else{
            $array["mensaje"] = "La clave no se pudo registrar";
      }
      return print(json_encode($array));
      break;
      case 'mostrar':
        $idusuario=isset($_POST["idusuario"])? limpiarCadena($_POST["idusuario"]):"";
        $rspta=$usuario->mostrar($idusuario);
        echo json_encode($rspta);
        break;
      break;
      case "selectCategoria":
        $rspta = $usuario->select();
        while ($reg = $rspta->fetch_object())
        {
              echo '<option value=' . $reg->ID . '>' . $reg->nombre . '</option>';
        }
      break;
      case "selectEmpresa":
        $rspta = $usuario->selec_empresa();
        while ($reg = $rspta->fetch_object())
        {
              echo $reg->nombre;
        }
      break;
      
      default:
      break;
  }

 ?>