<?php 
//Incluímos inicialmente la conexión a la base de datos
error_reporting(E_ALL);
ini_set('display_errors', '1');// Motrar todos los errores de PHP
ini_set('error_reporting', E_ALL);
require "../config/conexion.php";
 
Class Prestamos
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	} 

	//Implementamos un método para insertar registros
	public function insertar($idcliente,$monto,$monto_total,$id_indexdb,$id_ruta,$created_by,$id_empresa,$index_tabla)
	{
		$sql="INSERT INTO prestamos(idcliente,monto,monto_total,condicion,fecha_prestamo,id_indexdb,ID_RUTA,created_by,ID_EMPRESA,index_tabla)
		VALUES ('$idcliente','$monto','$monto_total','1',now(),$id_indexdb,$id_ruta,$created_by,$id_empresa,$index_tabla)";
		return ejecutarConsulta($sql);
	}
	public function eliminar($idprestamo)
	{
		$sql="DELETE FROM prestamos WHERE idprestamo = '$idprestamo'";
		return ejecutarConsulta($sql);
	}
	public function eliminarAbono($idabono,$idprestamo,$monto)
	{
		$sql="UPDATE prestamos set monto_total = monto_total + $monto WHERE idprestamo='$idprestamo'; DELETE FROM abonos WHERE idabono = '$idabono'";
		return ejecutarConsultaMult_query($sql);
	}

	public function insertarcliente($nombre,$cedula,$idruta,$iduser,$id_empresa)
	{
		$sql="INSERT INTO clientes (nombre,fecha_cliente,condicion,cedula,ID_RUTA,created_by,ID_EMPRESA)
		VALUES ('$nombre',now(),'1',$cedula,$idruta,$iduser,$id_empresa)";
		return ejecutarConsulta($sql);
	}

	public function leer_prestamos()
	{
		$sql = "select * from prestamos where condicion ='1'";
		return ejecutarConsulta($sql);
	}
	public function leer_abonos()
	{
		$sql = "select * from abonos";
		return ejecutarConsulta($sql);
	}
	public function insertarabono($idprestamo,$abonos)
	{
		$idruta = $_COOKIE['idruta'];
		$sql="INSERT INTO abonos(idprestamo,abono,fecha_abono,ID_RUTA)
		VALUES ('$idprestamo','$abonos',now(),'$idruta')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para editar registros
	public function editar($idprestamo,$monto,$monto_total)
	{
		$sql="UPDATE prestamos SET monto='$monto',monto_total='$monto_total' WHERE idprestamo='$idprestamo'";
		return ejecutarConsulta($sql);
	}
	public function editarPosicion($codigo,$posicion)
	{
		$sql="UPDATE prestamos SET index_tabla='$posicion' WHERE idprestamo='$codigo'";
		return ejecutarConsulta($sql);
	}
	
	

	//Implementamos un método para desactivar registros
	public function desactivar($idprestamo)
	{
		$sql="UPDATE prestamos SET condicion='0' WHERE idprestamo='$idprestamo'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para activar registros
	public function activar($idprestamo)
	{
		$sql="UPDATE prestamos SET condicion='1' WHERE idprestamo='$idprestamo'";
		return ejecutarConsulta($sql);

	}


	//Implementar un método para mostrar los datos de un registro a modificar
	public function mostrar($idprestamo)
	{
		$sql="SELECT *,c.direccion FROM prestamos as p INNER JOIN clientes as c ON p.idcliente = c.cedula WHERE p.idprestamo='$idprestamo'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Implementar un método para listar los registros
	public function listar($idruta)
	{
		$nivel_adm = $_COOKIE['nivel_adm'];
		$sql = "";

		if($nivel_adm==0)//cobrador
		{
			$sql="SELECT p.idprestamo,p.idcliente,p.index_tabla,p.fecha_prestamo,c.nombre,p.monto,p.monto_total,p.condicion FROM prestamos p INNER JOIN clientes c ON p.idcliente=c.cedula where p.ID_RUTA='$idruta' AND p.monto_total > 0 ORDER BY p.index_tabla ASC";
		}else{
			$sql="SELECT p.idprestamo,p.idcliente,p.index_tabla,p.fecha_prestamo,c.nombre,p.monto,p.monto_total,p.condicion FROM prestamos p INNER JOIN clientes c ON p.idcliente=c.cedula where p.ID_RUTA='$idruta' ORDER BY p.index_tabla ASC";
		}
		
		return ejecutarConsulta($sql);		
	}

	

	public function listarabonos($idprestamo)
	{
		$sql="SELECT * from abonos where idprestamo='$idprestamo'";
		return ejecutarConsulta($sql);		
	}
	public function listar_reclientes($desde,$hasta)
	{
		$idruta = $_COOKIE['idruta'];
		$sql="SELECT p.idprestamo,p.idcliente,p.fecha_prestamo,c.nombre,p.monto,p.monto_total,p.condicion FROM prestamos p INNER JOIN clientes c ON p.idcliente=c.cedula where p.ID_RUTA='$idruta' AND p.fecha_prestamo BETWEEN '$desde' AND '$hasta' ";
		return ejecutarConsulta($sql);
	}
	public function listar_reclientesAbonos($desde,$hasta)
	{
		$idruta = $_COOKIE['idruta'];
		$sql="SELECT a.fecha_abono,(Select nombre From clientes where cedula=p.idcliente) AS nombre,a.abono FROM abonos a INNER JOIN prestamos p ON a.idprestamo=p.idprestamo where a.ID_RUTA='$idruta' AND a.fecha_abono BETWEEN '$desde' AND '$hasta' ";//
		return ejecutarConsulta($sql);
	}
}

?>