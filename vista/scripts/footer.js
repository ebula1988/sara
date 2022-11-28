//Cargamos los items al select categoria
	$.post("../ajax/usuarios.php?r=selectEmpresa", function(r){
	            $("#nombreEmpresa").html(r);

	});