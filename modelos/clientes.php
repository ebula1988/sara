<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/conexion.php";

Class Clientes
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	}

	//Implementamos un método para insertar registros
	public function insertar($nombre,$cedula,$idruta,$iduser,$id_empresa,$direccion)
	{
		$sql="INSERT INTO clientes (nombre,fecha_cliente,condicion,cedula,ID_RUTA,created_by,ID_EMPRESA,direccion)
		VALUES ('$nombre',now(),'1',$cedula,$idruta,$iduser,$id_empresa,'$direccion')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para editar registros
	public function editar($idcliente,$nombre,$cedula,$direccion)
	{
		$sql="UPDATE clientes SET nombre='$nombre', cedula='$cedula',direccion='$direccion' WHERE cedula='$idcliente'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para desactivar categorías
	public function desactivar($idcliente)
	{
		$sql="UPDATE clientes SET condicion='0' WHERE cedula='$idcliente'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para activar categorías
	public function activar($idcliente)
	{
		$sql="UPDATE clientes SET condicion='1' WHERE cedula='$idcliente'";
		return ejecutarConsulta($sql);
	}

	//Implementar un método para mostrar los datos de un registro a modificar
	public function mostrar($idcliente)
	{
		$sql="SELECT * FROM clientes WHERE cedula='$idcliente'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Implementar un método para listar los registros
	public function listar_todos($idruta)
	{
		$sql="SELECT * FROM clientes where ID_RUTA='$idruta'";
		return ejecutarConsulta($sql);		
	}
	public function listar($idruta)
	{
		$sql="SELECT * FROM clientes where ID_RUTA='$idruta'";
		return ejecutarConsulta($sql);		
	}
	
	//Implementar un método para listar los registros y mostrar en el select
	public function select()
	{
		$sql="SELECT * FROM clientes where condicion=1";
		return ejecutarConsulta($sql);		
	}
}

?>