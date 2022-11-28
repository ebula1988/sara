<?php  
	$file = $_GET['file'];
	$FILES_PATH = "file";
	if(!isset($file)){
		header("Location: ./vista/login.php");
	}else{
		if(file_exists($FILES_PATH . "/$file")) {

		$data = fopen($FILES_PATH . "/$file", "r");

		$size = filesize($FILES_PATH . "/$file");

		$type= filetype($FILES_PATH . "/$file");

		$file_content = fread($data,$size);

		header("Content-type: $type");

		header("Content-length: $size");

		header("Content-Disposition: attachment; filename=$file");

		header("Content-Description: PHP Generated Data");

		echo $file_content;

		} else {

		echo "<script languaje='javascript'>

		alert('Archivo no encontrado');
		</script>";
			header("Location: ./login.php");
		}		
	}


?>