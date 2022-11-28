$( document ).ready(function() {
    init();
});

function init(){
	tabla=$('#tbllistado').dataTable(
	{
		"aProcessing": true,//Activamos el procesamiento del datatables
	    "aServerSide": true,//Paginación y filtrado realizados por el servidor
	    dom: 'Bfrtip',//Definimos los elementos del control de tabla
	    buttons: [		          
		            'copyHtml5',
		            'excelHtml5',
		            'csvHtml5',
		            'pdf'
		        ],
		"ajax":
				{
					url: '../ajax/usuarios.php?r=listar_usuarios',
					type : "get",
					dataType : "json",						
					error: function(e){
						console.log(e);	
					}
				},
		"bDestroy": true,
		"iDisplayLength": 5,//Paginación
	    "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
	}).DataTable();

	$("#formulario").on("submit",function(e)
	{
		guardaryeditar(e);	
	})

	$("#formularioclave").on("submit",function(e)
	{
		guardarclave(e);	
	})

	

	//Cargamos los items al select categoria
	$.post("../ajax/usuarios.php?r=selectCategoria", function(r){
	            $("#idruta").html(r);
	            $('#idruta').selectpicker('refresh');

	});
}

function mostrarform(flag)
{
	limpiar();
	if (flag)
	{
		$("#listadoregistros").hide();
		$("#formularioregistros").show();
		$("#btnGuardar").prop("disabled",false);
		$("#btnagregar").hide();
	}
	else
	{
		$("#formularioclave").hide();
		$("#listadoregistros").show();
		$("#formularioregistros").hide();
		$("#btnagregar").show();
	}
}

//Función limpiar
function limpiar()
{
	$("#usuario").val("");
	$("#idusuario").val("");
	$("#clave").val("");
	$("#correo").val("");
}
function mostrar(idusuario)
{
	$.post("../ajax/usuarios.php?r=mostrar",{idusuario : idusuario}, function(data, status)
	{
		data = JSON.parse(data);		
		mostrarform(true);

		$("#usuario").val(data.usuario);
 		$("#idusuario").val(data.ID);
 		$("#idusuarioclave").val(data.ID);
 		$("#correo").val(data.correo);
 		$("#id_nivel_adm").val(data.nivel_adm);
 		$("#bloqueClave").hide();
 		//$("#bloqueCorreo").hide();
 		$("#btnEdicarClave").show();

 	})
}
//Función cancelarform
function cancelarform()
{
	mostrarform(false);
}
function guardarclave(e)
{

	e.preventDefault(); //No se activará la acción predeterminada del evento
	var pass1 = $("#guardar_clave").val();
	var pass2 = $("#conf_clave").val();
	if(pass1!=pass2){
		swal(
             'Error',
             'Las contraseñas no coinciden',
             'error'
           	)
		return;
	}
	$("#btnGuardarClave").prop("disabled",true);
	var formData = new FormData($("#formularioclave")[0]);

	$.ajax({
		url: "../ajax/usuarios.php?r=guardarclave",
	    type: "POST",
	    data: formData,
	    contentType: false,
	    processData: false,
	    dataType: 'json',
	    success: function(datos)
	    {    
	    	var str = (!datos.status) ? 'error' : 'success';       
	    	var title = (!datos.status) ? 'Error' : 'Exito';
	        swal(
             title,
             ''+datos.mensaje,
             str
           	)
	        cancelarClave();
           	$("#btnGuardarClave").prop("disabled",false);        
	    }

	});
	
}
function guardaryeditar(e)
{

	var length = $('#idruta > option').length;
	if(length==0){
		swal(
             'Error',
             'No hay rutas disponibles',
             'error'
        )
		return;
	}
	

	e.preventDefault(); //No se activará la acción predeterminada del evento
	$("#btnGuardar").prop("disabled",true);
	var formData = new FormData($("#formulario")[0]);

	$.ajax({
		url: "../ajax/usuarios.php?r=guardaryeditar",
	    type: "POST",
	    data: formData,
	    contentType: false,
	    processData: false,
	    dataType: 'json',
	    success: function(datos)
	    {    
	    	var str = (datos.existe) ? 'error' : 'success';       
	    	var title = (datos.existe) ? 'Error' : 'Exito';
	        swal(
             title,
             ''+datos.mensaje,
             str
           	)
           	if(!datos.existe){
           		mostrarform(false);
	          	tabla.ajax.reload();
	          	limpiar();
           	} 
           	$("#btnGuardar").prop("disabled",false);        
	    }

	});
	
}

function mostrarClaveForm(){
	$("#btnEdicarClave").prop("disabled",true);
	$("#btnGuardar").prop("disabled",true);
	$("#btnCancelar").prop("disabled",true);
	$("#formularioclave").show();
}

function cancelarClave(){
	$("#btnEdicarClave").prop("disabled",false);
	$("#btnGuardar").prop("disabled",false);
	$("#btnCancelar").prop("disabled",false);	
	$("#formularioclave").hide();
	$("#guardar_clave").val('');
	$("#conf_clave").val('');
	
}