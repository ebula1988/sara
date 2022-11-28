<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/conexion.php";
Class Usuarios
{
	//Implementamos nuestro constructor
	

	public function __construct()
	{

	}

	//Implementamos un método para insertar registros
	public function insertar($usuario,$clave,$correo,$nivel_adm,$idruta)
	{
		$id_empresa = $_COOKIE['ID_EMPRESA'];
		$sql="INSERT INTO usuarios (usuario,clave,correo,nivel_adm,fecha,status,ID_EMPRESA,ID_RUTA)
		VALUES ('$usuario','$clave','$correo','$nivel_adm',now(),'1','$id_empresa','$idruta')";
		return ejecutarConsulta($sql);
	}

	public function editar($idusuario,$user,$correo,$id_nivel_adm,$idruta){
		$sql="UPDATE usuarios SET usuario='$user', correo='$correo', nivel_adm='$id_nivel_adm', ID_RUTA='$idruta' WHERE ID='$idusuario'";
		return ejecutarConsulta($sql);
	}

	public function editarClave($idusuarioclave,$hashed_password){
		$sql="UPDATE usuarios SET clave='$hashed_password' WHERE ID='$idusuarioclave'";
		return ejecutarConsulta($sql);
	}

	public function verificarSiExisteUsuario($user,$idusuario){
		$id_empresa = $_COOKIE['ID_EMPRESA'];
		global $conexion;
		$consulta = $conexion->prepare("select * from usuarios where usuario = ? and ID_EMPRESA = ?");
		$consulta->bind_param("ss", $user,$id_empresa);	
		$consulta->execute();
		$existe = false;
		$result = $consulta->get_result()->fetch_assoc();
		if (!$result) {
			$existe = false;
		}else{
			if($idusuario == $result['ID']){
				$existe = false;
			}else{
				$existe = true;
			}
			
		}
		return $existe;
	}
	public function verificarSiExisteCorreo($correo,$idusuario){
		$id_empresa = $_COOKIE['ID_EMPRESA'];
		global $conexion;
		$consulta = $conexion->prepare("select * from usuarios where correo = ? and ID_EMPRESA = ?");
		$consulta->bind_param("ss", $correo,$id_empresa);	
		$consulta->execute();
		$existe = false;
		$result = $consulta->get_result()->fetch_assoc();
		if (!$result) {
			$existe = false;
		}else{
			if($idusuario == $result['ID']){
				$existe = false;
			}else{
				$existe = true;
			}
			
		}
		return $existe;
	}


	//Implementamos un método para desactivar categorías
	public function desactivar($idcliente)
	{
	/*	$sql="UPDATE clientes SET condicion='0' WHERE idcliente='$idcliente'";
		return ejecutarConsulta($sql);*/
	}

	//Implementamos un método para activar categorías
	public function activar($idcliente)
	{
		/*$sql="UPDATE clientes SET condicion='1' WHERE idcliente='$idcliente'";
		return ejecutarConsulta($sql);*/
	}
 /*	public function filtrarMontoCobrado($desde,$hasta)
	{
		global $conexion;

		$consulta = $conexion->prepare("SELECT * FROM prestamos WHERE fecha_prestamo BETWEEN '$desde' AND '$hasta'");	
		$consulta->execute();
		$arreglo = ["existe" => false];
		$result = $consulta->get_result()->fetch_assoc();
		if ($result) {

			$pass_hashed = $result['clave'];
			if (crypt($pass,$pass_hashed) == $pass_hashed){
				$arreglo["existe"] = true;
				$arreglo["usuario"] = $result["usuario"];
				$arreglo["id"] = $result["ID"];
				$arreglo["nivel_adm"] = $result["nivel_adm"];
				$arreglo["correo"] = $result["correo"];
				$arreglo["ID_EMPRESA"] = $result["ID_EMPRESA"];
			}else{
				$arreglo["mensaje"] = "Datos Erroneos";
			}
    	}else{
    		$arreglo["mensaje"] = "Usuario no encontrado en el sistema";
    	}
		return json_encode($arreglo);
	}*/
	public function filtrarMontoPrestado($desde,$hasta)
	{
		$idruta = $_COOKIE['idruta'];
		$sql = "SELECT SUM(monto) AS monto FROM prestamos WHERE  fecha_prestamo BETWEEN '$desde' AND '$hasta' 
		and ID_RUTA='$idruta'";
		return ejecutarConsultaSimpleFila($sql);
	}
	public function filtrarMontoCobrado($desde,$hasta)
	{
		$idruta = $_COOKIE['idruta'];
		$sql = "SELECT SUM(abono) AS abono FROM abonos WHERE fecha_abono BETWEEN '$desde' AND '$hasta'
		and ID_RUTA='$idruta'";
		return ejecutarConsultaSimpleFila($sql);
	}
	public function filtrarMontoXCobrar($desde,$hasta)
	{
		$idruta = $_COOKIE['idruta'];
		$sql = "SELECT SUM(monto_total) AS monto FROM prestamos WHERE ID_RUTA='$idruta'";
		return ejecutarConsultaSimpleFila($sql);
	}

	public function loguear($user,$pass)
	{
		global $conexion;
		$consulta = $conexion->prepare("select * from usuarios where usuario = ?");	
		$consulta->bind_param("s", $user);
		$consulta->execute();
		$arreglo = ["existe" => false];
		$result = $consulta->get_result()->fetch_assoc();
		if ($result) { 

			$pass_hashed = $result['clave'];
			if (crypt($pass,$pass_hashed) == $pass_hashed){
				if($result["status"]==0){
					$arreglo["mensaje"] = "Usuario suspendido por falta de pago.";
				}else{
					$arreglo["existe"] = true;
					$arreglo["usuario"] = $result["usuario"];
					$arreglo["id"] = $result["ID"];
					$arreglo["nivel_adm"] = $result["nivel_adm"];
					$arreglo["correo"] = $result["correo"];
					$arreglo["ID_EMPRESA"] = $result["ID_EMPRESA"];
					$arreglo["ID_RUTA"] = $result["ID_RUTA"];
					$arreglo["status"] = $result["status"];	
				}
				
			}else{
				$arreglo["mensaje"] = "Datos Erroneos";
			}
    	}else{
    		$arreglo["mensaje"] = "Usuario no encontrado en el sistema";
    	}
		return json_encode($arreglo);
	}
	public function listar()
	{
		$id_empresa = $_COOKIE['ID_EMPRESA'];
		$sql="SELECT * FROM usuarios where ID_EMPRESA = $id_empresa";
		return ejecutarConsulta($sql);		
	}

	public function mostrar($idusuario)
	{
		$sql="SELECT * FROM usuarios WHERE ID='$idusuario'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Implementar un método para listar los registros y mostrar en el select
	public function select()
	{
		$sql="SELECT * FROM ruta where ID_EMPRESA=".$_COOKIE['ID_EMPRESA'];
		return ejecutarConsulta($sql);		
	}
	public function selec_empresa()
	{
		$sql="SELECT nombre FROM empresa where ID=".$_COOKIE['ID_EMPRESA'];
		return ejecutarConsulta($sql);		
	}


}

?>