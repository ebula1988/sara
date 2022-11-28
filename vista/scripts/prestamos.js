var tabla,tablaabonos;
var montototal_selected = 0;
var db = null;
var index_selected = 0;
var id_indexdb_selected = -1;
var is_ordening_tbl = false;
var montoCobrado = 0;
var montoPrestado = 0;
var total = 0;
var yScroll=0;
//Función que se ejecuta al inicio
function init(){
	$(window).scroll(function(){
		if( $(this).scrollTop() > 2000 ){
			$('.ir-arriba').slideDown(300);
		} else {
			$('.ir-arriba').slideUp(300);
		}
	});
	$.fn.datepicker.defaults.format = "yyyy/mm/dd";
	$('.datepicker').datepicker({
	    startDate: '-3d'
	});

	cargarTotal();

	db = new Dexie("ebula");

	Dexie.exists('ebula').then(function (exists) {
	if (exists) {
		console.log('existe la base de datos');
		db.version(1).stores({
			clientes: 'id++,idcliente,nombre,fecha_cliente,condicion,cedula',
	        prestamos: 'id++,idprestamo,idcliente,monto,monto_total,condicion,fecha_prestamo,type,abonos,id_indexdb_selected',
	        abonos: 'idabono,idprestamo,abono,fecha_abono'
		});
		db.open().catch(function (e) {
	    console.error("Open failed: " + e.stack);
		})
		//db.prestamos.put(lista_prestamos[i]).catch(function(error) {console.log ("Ooops: " + error);
		//db.abonos.put(lista_abonos[i]).catch(function(error) {console.log ("Ooops: " + error);
		getPrestamoByID(db,2);
	}
	});/*final de la instancia Dexie*/


	mostrarform(false);
	listar();
	sumarentradas()
 
	$("#formulario").on("submit",function(e)
	{
		guardaryeditar(e,db);	
	})

	$("#formularioCliente").on("submit",function(e)
	{
		guardarCliente(e,db);
	})

	//Cargamos los items al select categoria
	$.post("../ajax/prestamos.php?op=selectCategoria", function(r){
	            $("#idcliente").html(r);
	            $('#idcliente').selectpicker('refresh');

	});

}
function refresh(){
	location.reload();
}
function volver(){
	$("#seccionResultado").hide();
	$("#seccionPrestamos").show();
}
function filtrarClientes(value){
	if(navigator.onLine){
	$("#seccionResultado").show();
	$("#seccionPrestamos").hide();
	var myRadio = $("input[name=optionsRadios]");
	var checkedValue = myRadio.filter(":checked").val();
	var desde,hasta;
	if(checkedValue=="dia"){
		desde = getDate();
  		hasta = getTomorrow();
	}else{
		desde = $('#desde').val() 
		hasta = $('#hasta').val();
	}
	if(value==1){
		var str = (checkedValue=="dia") ? "el dia de hoy." : "la fecha "+desde+" - "+hasta;
		$("#tituloResultado").html("Resultado de Prestamos para "+str);
		tabla=$('#tabla_reclientes').dataTable(
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
						url: '../ajax/prestamos.php?op=listar_reclientes&desde='+desde+'&hasta='+hasta,
						type : "get",
						dataType : "json",	
						contentType: false,
		    			processData: false,					
						error: function(e){
							console.log(e);	
						}
					},
			"bDestroy": true,
			"iDisplayLength": 20,//Paginación
		    "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
		}).DataTable();		
	}else{
		var str = (checkedValue=="dia") ? "el dia de hoy." : "la fecha "+desde+" - "+hasta;
		$("#tituloResultado").html("Resultado de Abonos para "+str);
      	
		tabla=$('#tabla_reclientes').dataTable(
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
						url: '../ajax/prestamos.php?op=listar_reclientesAbonos&desde='+desde+'&hasta='+hasta,
						type : "get",
						dataType : "json",	
						contentType: false,
		    			processData: false,					
						error: function(e){
							console.log(e);	
						}
					},
			"bDestroy": true,
			"iDisplayLength": 20,//Paginación
		    "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
		}).DataTable();			
	}
}else{
     	swal(
	             'Error',
	             'Necesitas acceso a internet para realizar esta operación',
	             'error'
	    )
     }
}
function eliminarAbono(idabono,idprestamo,abono){

  if(navigator.onLine){
  	var myRadio = $("input[name=optionsRadios]");
	var checkedValue = myRadio.filter(":checked").val();
  	var r = confirm("Esta seguro que quiere eliminar este Abono?");
	if (r == true) {

	  $.ajax({
	       url: '../ajax/prestamos.php?op=eliminarAbono',
	       type: 'POST',
	       data: {
	          "idabono":idabono,
	          "idprestamo":idprestamo,
	          "monto":abono
	        },
	       beforeSend: function(){
	         $("#btnAbonoEliminar"+idabono).prop('disabled', true);
	       }
	     })
	     .done(function(resp) {
	     if(checkedValue=="dia"){
	     		cargarTotal();
			}else{
				aplicarFiltro();
			}
	      tablaabonos.ajax.reload();

	      swal(
	             'Exito',
	             resp,
	             'success'
	           )
	     })
	     .fail(function(err,object,name) {
	        console.log("request failed");
	     })
	     .always(function() {
	       $("#btnAbonoEliminar"+idabono).prop('disabled', false);
	     });
	 } 
     }else{
     	swal(
	             'Error',
	             'No hay Internet para eliminar abonos',
	             'error'
	    )
     }
}
function eliminarPrestamo(idprestamo){
  if(navigator.onLine){
  	var myRadio = $("input[name=optionsRadios]");
	var checkedValue = myRadio.filter(":checked").val();
  	var r = confirm("Esta seguro que quiere eliminar este prestamo?");
	if (r == true) {

	  $.ajax({
	       url: '../ajax/prestamos.php?op=eliminar',
	       type: 'POST',
	       data: {
	          "idprestamo":idprestamo,
	        },
	       beforeSend: function(){
	         $("#btnEliminar"+idprestamo).prop('disabled', true);
	       }
	     })
	     .done(function(resp) {
	     	if(checkedValue=="dia"){
	     		cargarTotal();
			}else{
				aplicarFiltro();
			}
	      tabla.ajax.reload();
	      swal(
	             'Exito',
	             resp,
	             'success'
	           )
	     })
	     .fail(function(err,object,name) {
	        console.log("request failed");
	     })
	     .always(function() {
	       $("#btnEliminar"+idprestamo).prop('disabled', false);
	     });
	 } 
     }else{
     	swal(
	             'Error',
	             'No hay Internet para eliminar prestamos',
	             'error'
	    )
     }
}

function cargarTotal(){
  habilitarFechas(false)
  var desde = getDate();
  var hasta = getTomorrow();
  /*MONTO PRESTADO*/
  $.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoPrestado"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
      var monto = (!resp.monto) ? 0 : resp.monto;
      montoPrestado = parseFloat(monto);
      $("#montoPrestado").html("Monto Prestado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });

     /*MONTO COBRADO*/
  	$.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoCobrado"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
     	if(resp.disconnect){
        	window.location.href = "logout.php?close=yes";
      	}
      var monto = (!resp.abono) ? 0 : resp.abono;
      $("#montoCobrado").html("Monto Cobrado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });

     /*MONTO X COBRAR*/
  	$.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoXCobrar"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
     	console.log(resp);
      var monto = (!resp.monto) ? 0 : resp.monto;
      $("#montoxPagar").html("Monto Por Cobrar "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });


}

function habilitarFechas(value){

	if(value){
		$("#desde").prop("disabled",false); 
		$("#hasta").prop("disabled",false); 
		$("#btnAplicar").prop("disabled",false); 
	}else{
		$("#desde").prop("disabled",true); 
		$("#hasta").prop("disabled",true); 
		$("#btnAplicar").prop("disabled",true); 	
	}
}
function getDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm;
  } 
  var today = yyyy + '/' + mm + '/' + dd;
  return today;
}
function getTomorrow(){
  var today = new Date();
  var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
  var dd = tomorrow.getDate();
  var mm = tomorrow.getMonth() + 1; //January is 0!

  var yyyy = tomorrow.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm; 
  } 
  today = yyyy + '/' + mm + '/' + dd;
  return today;
}
/*function updateMontoCobrado(monto){
	if(monto==0)return;
	montoCobrado += parseFloat(monto);
	$("#montoCobrado").html("Monto Cobrado "+montoCobrado+"$");
	var aux = montoPrestado * .20;
	total = (montoPrestado + aux) - montoCobrado;
	$("#montoxPagar").html("Monto Por Cobrar "+total+"$");
}*/
function updateMontoPrestado(monto){
	if(monto==0)return;
	montoPrestado += monto;
	var aux = montoPrestado * .20;
    total = (montoPrestado + aux) - montoCobrado;
	$("#montoPrestado").html("Monto Prestado "+montoPrestado+"$");
	$("#montoxPagar").html("Monto Por Cobrar "+total+"$");
}
function aplicarFiltro(){
	
	
	var total = 0;
	var desde = $('#desde').val() 
	var hasta = $('#hasta').val();
	$.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoPrestado"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
     	console.log(resp);
      var monto = (!resp.monto) ? 0 : resp.monto;
      montoPrestado = parseFloat(monto);
      $("#montoPrestado").html("Monto Prestado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });

    /*MONTO COBRADO*/
  	$.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoCobrado"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
      var monto = (!resp.abono) ? 0 : resp.abono;
      $("#montoCobrado").html("Monto Cobrado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });
          /*MONTO X COBRAR*/
  	$.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "desde":desde,
          "hasta":hasta,
          "r"   :"filtrarMontoXCobrar"
        },
       beforeSend: function(){
         $("#btnAplicar").prop('disabled', true);
       }
     })
     .done(function(resp) {
     	console.log(resp);
      var monto = (!resp.monto) ? 0 : resp.monto;
      $("#montoxPagar").html("Monto Por Cobrar "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });
}
function ordenar(){
	if(navigator.onLine){
	var index;
	var flag = false;
	$('#tbllistado tbody').on( 'click', 'button', function () {
		if(flag) return;
		if(is_ordening_tbl){
			alert("Ya hay un ordenamiento en ejecución, espere que finalice");
			flag = true;
			return;
		}
		is_ordening_tbl = true;
		var table = $('#tbllistado').DataTable();
        index = table.row( $(this).parents('tr') ).index();

		var posicion = prompt("Por favor ingrese la posición al que desea subir", index);
		if (posicion != null) {
			//console.log('index: '+index+' posicion: '+posicion);
			var l = table.rows().count();
			if(posicion>(l-1)){
				alert("Posicion supera la cantidad de filas de la tabla");
				is_ordening_tbl = false;
	        	flag = true;
				return;
			}
	        if(index<=posicion){
	        	/*alert("Por favor Ingrese una Posición menor");
	        	is_ordening_tbl = false;
	        	flag = true;
				return;*/
				for (var i = index; i < posicion; i++) {
					var aux;
					if(i<=posicion-1){
					var selectedRow = table.row(i).data();
					var auxRow = table.row(i+1).data();
					guardarFilaPrestamo(auxRow[6],i);//[6] == codigo del prestamo
					aux = auxRow;
					table.row(i).data(auxRow);
					table.row(i+1).data(selectedRow);	
					}else{
						table.row(i-1).data(selectedRow);
						table.row(i).data(aux);	
					}
				}
				guardarFilaPrestamo(selectedRow[6],i);//[6] == codigo del prestamo
				is_ordening_tbl = false;
	        	table.page(0).draw(false);
	        	setTimeout(function(){
	        		showMessage('Posiciones Actualizadas');
	        		tabla.ajax.reload();
	        	}, 2000);
	        	
	        }else{
				for (var i = index; i > posicion; i--) {
					var aux;
					if(i>=1){
					var selectedRow = table.row(i).data();
					var auxRow = table.row(i-1).data();

					
					guardarFilaPrestamo(auxRow[6],i);//[6] == codigo del prestamo

				//	console.log(auxRow);
					aux = auxRow;
					table.row(i).data(auxRow);
					table.row(i-1).data(selectedRow);				
					}else{
						
						table.row(0).data(selectedRow);
						table.row(1).data(aux);	
					}
				}
				guardarFilaPrestamo(selectedRow[6],i);//[6] == codigo del prestamo
				is_ordening_tbl = false;
	        	table.page(0).draw(false);
	        	setTimeout(function(){
	        		showMessage('Posiciones Actualizadas');
	        		tabla.ajax.reload();
	        	}, 2000);	        	
	        }
			


		}else{
			is_ordening_tbl = false;
		}
		flag = true;
    } );
    }else{
     	swal(
	             'Error',
	             'Necesitas acceso a internet para realizar un ordenamiento',
	             'error'
	    )
     }
}
function guardarFilaPrestamo(codigo,posicion){
		var table = $('#tbllistado').DataTable();
		//table.cell(posicion,1).data("asd: "+posicion).draw();
		$.ajax({
		url: "../ajax/prestamos.php?op=guardarposicion",
		type: "POST",
		data: {
			posicion:posicion,
			codigo:codigo
		},
		success: function(datos)
		{                    
			console.log('posicion '+posicion+' guardada exitosamente');
		}
		});
}
function timeConverter(UNIX_timestamp){
  return moment(UNIX_timestamp).format("YYYY-MM-DD HH:mm:ss");;
}
function addRow(data,id){

	var t = $('#tbllistado').DataTable();
	t.row.add( [
            '<button class="btn btn-warning"  onclick="mostrar('+data.idprestamo+','+t.rows().count()+','+id+')"><i class="fa fa-pencil"></i>abono</button> <img src="../public/img/up.png" class="mini-iconos" onclick="ordenar()">',
            ''+timeConverter(data.fecha_prestamo),
            ''+data.cliente,
            ''+data.monto,
            ''+data.monto_total
    ] ).draw( false );
}

//Función limpiar
function limpiar()
{
	$("#monto").val("");
	$("#monto_total").val("");
	$("#idprestamo").val("");
	$("#abonos").val("");
}

/*function login()
{
	//instansciamos la bdd
	Dexie.exists('ebula').then(function (exists) {
	//añadirlas al indexeddb
	if (exists) {

		console.log('existe la base de datos');
			Dexie.delete('ebula').then(() => {
				console.log("Database successfully deleted");
			}).catch((err) => {
				console.error("Could not delete database");
			}).finally(() => {});
	}else{
		console.log('no existe y la voy a crear');
		db = new Dexie("ebula");
		db.version(1).stores({
			clientes: 'id++,idcliente,nombre,fecha_cliente,condicion,cedula',
	        prestamos: 'id++,idprestamo,idcliente,monto,monto_total,condicion,fecha_prestamo,type,abonos,id_indexdb_selected',
	        abonos: 'idabono,idprestamo,abono,fecha_abono'
		});
		db.open().catch(function (e) {
		    console.error("Open failed: " + e.stack);
		})
	}
	});/*final de la instancia Dexie*/

//}*/

/*modelos*/

function getPrestamoByID(db,id){
	var flag = true;

	/*db.prestamos.where("id").equals(id).modify(function(value) {
	    delete this.value;
	});*/

	db.prestamos.each(function (item, cursor) {
	//	if(item.idprestamo==id && flag){
			console.log(item);
	//	}
	 	
	});
	/*console.log(db);
	db.prestamos.where('idprestamo').equalsIgnoreCase(id.toString()).each(function (result) {
		console.log("monto: " + result.monto + ". total: " + result.monto_total);
	}).catch(function (error) {
		console.error(error);
	});*/
}

function getAbonoByID(db,id){
	db.abonos.where('idabono').equalsIgnoreCase(id.toString()).each(function (result) {
		console.log("idprestamo: " + result.idprestamo + ". abono: " + result.abono);
	}).catch(function (error) {
		console.error(error);
	});
}

//Función mostrar formulario
function mostrarform(flag,value)
{

	
	if(value){
		console.log('estoy editando');
		$("#monto").prop('readonly', true);
	//	$("#idcliente").prop('disabled', true);
		$("#listClientes").hide();
	}else{
		console.log('estoy agregando');
		$("#monto").prop('readonly', false);
		$("#listClientes").show();
		//$("#idcliente").prop('disabled', false);
	}
	limpiar();
	if (flag)
	{
		yScroll=self.pageYOffset || (document.documentElement.scrollTop+document.body.scrollTop);

		$("#listadoregistros").hide();
		$("#formularioregistros").show();
		$("#panelMontos").hide();
		
			

		$("#btnGuardar").prop("disabled",false);
		$("#btnagregar").hide();	

	}
	else
	{
		$("#panelMontos").show();
		$("#listadoregistros").show();
		$("#formularioregistros").hide();
	
		$("#btnagregar").show();

		/*ocultar datos de abono*/
		$("#abonos").hide();
		$("#abono_titulo").hide();
		$("#tituloidprestamo").hide();
		$("#idprestamo").hide();
		$("#listadoabonos").hide();
		id_indexdb_selected= -1;
		
	}
}




//Función cancelarform
function cancelarform()
{
	limpiar();
	mostrarform(false);
	$("#formularioclientes").hide();
	console.log('yScroll: '+yScroll);
	$('html, body').animate({scrollTop:yScroll}, 'slow');
}

//Función Listar
function listar()
{
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
					url: '../ajax/prestamos.php?op=listar',
					type : "get",
					dataType : "json",	
					contentType: false,
	    			processData: false,					
					error: function(e){
						console.log(e);	
					}
				},
		"bDestroy": true,
	//	"iDisplayLength": 15,//Paginación
		"bPaginate": false,
	    "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
	}).DataTable();


	/*$.ajax({
		url: "../ajax/prestamos.php?op=listar",
	    type: "GET",
	    dataType: "json"
	}).done(function(resp) {
      	console.log(resp);
    })
    .fail(function(err,object,name) {
      console.log(JSON.stringify(err));
    })*/

}
 
function listarabonos(idprestamo)
{
	if(idprestamo!=-1){
			tablaabonos=$('#tblabonos').dataTable(
			{
				"aProcessing": true,//Activamos el procesamiento del datatables
			    "aServerSide": true,//Paginación y filtrado realizados por el servidor
			    dom: 'Bfrtip',//Definimos los elementos del control de tabla
			    buttons: [],
				"ajax":
						{
							url: '../ajax/prestamos.php?op=listarabonos&idpres='+idprestamo,
							type : "get",
							dataType : "json",						
							error: function(e){
								console.log(e.responseText);	
							}
						},
				"bDestroy": true,
				"iDisplayLength": 5,//Paginación
			    "order": [[ 0, "asc" ]]//Ordenar (columna,orden)
			}).DataTable();
	}

	var t = $('#tblabonos').DataTable();
	db.prestamos.each(function (item, cursor) {
		if(item.idprestamo!=-1){
			if(item.idprestamo==idprestamo){
				var abonos = item.abonos;
				t.row.add( [
            	''+abonos,
            	''+timeConverter(Date.now())
    			] ).draw( false );
				}
		}else{
			if(id_indexdb_selected!=-1){
				if(item.id_indexdb_selected==id_indexdb_selected){
				var abonos = item.abonos;
				t.row.add( [
            	''+abonos,
            	''+timeConverter(Date.now())
    			] ).draw( false );
				}
			}
		}
	});
}


function showMessage(str,value,delay){
	var type = "success";
	var d = (delay) ? delay : 1000;
	if(value) type = "danger";
	console.log('message: '+str);
	$.notify({
	// options
		icon: 'fa fa-pencil',
		message: ''+str
	},{
		// settings
		type: type,
		position: null,
		allow_dismiss: true,
		newest_on_top: true,
		placement: {
		from: "top",
		align: "center"
		},
		delay: d,
		timer: 1000,

	});
}
function abrirFrmCliente(){
	$("#listadoregistros").hide();
	$("#formularioclientes").show();
	$("#nombre").val("");
	$("#cedula").val("");
	//$("#btnGuardar").prop("disabled",false);
	//$("#btnagregar").hide();	
	console.log('abrirFrmCliente');
}

//Función para guardar o editar
function saveCliente(db,value){
	var formData = new FormData($("#formularioCliente")[0]);
	var contador = 0;
			db['clientes'].count(function (count) { 
				//verificar que hayan objetos en la tabla prestamo offline
				if(count>0){
					//alert("hay muchos objetos en la tabla offline "+count);
					//iteramos la tabla prestamos offline para luego registrarla a la bdd del servidor
					db.clientes.each(function (item, cursor) {
						contador++;
						$.ajax({
							url: "../ajax/prestamos.php?op=guardarCliente",
							type: "POST",
							data:item,
							beforeSend: function(){
				        		$("#btnGuardar").prop('disabled', true);
				      		}
						})
						.done(function(resp) {
							$("#btnGuardar").prop('disabled', false);
							showMessage('Cliente en cola añadido exitosamente');
							/*ELIMINAR EL ITEM DE LA BASE DE DATOS OFFLINE*/
							db.clientes.where("id").equals(item.id).modify(function(value) {
								delete this.value;
							});
						})
						.fail(function(err,object,name) {
							$("#btnGuardar").prop('disabled', false);
						})
						//ya termino de registrar los que estaban en cola(indexedb)
						if(contador>=count){
							//ahora registra el nuevo
							bootbox.alert('Se han guardado todos los clientes en cola, ya puede guardar este cliente.');
						}
					});
				}else{
					//no hay clientes en cola, registrar directamente
					if(value){
						$.ajax({
									url: "../ajax/prestamos.php?op=guardarCliente",
									type: "POST",
									data:formData,
									contentType: false,
									processData: false,
									beforeSend: function(){
					        			$("#btnGuardar").prop('disabled', true);
					      			}
								}) 
								.done(function(html) {
									$("#btnGuardar").prop('disabled', false);
									$("#idcliente").append(html);
									$('#idcliente').selectpicker('refresh');
									bootbox.alert('Se ha registrado el cliente exitosamente');
									cancelarform();
									limpiar();	 
								})
								.fail(function(err,object,name) {
									showMessage('Error, Intentelo nuevamente.',true);
									console.log(JSON.stringify(err));
									$("#btnGuardar").prop('disabled', false);
								})	
					}
					
				}
			});
}
function guardarCliente(e,db){
	e.preventDefault();
	var formData = new FormData($("#formularioCliente")[0]);
		if(navigator.onLine){
			//si esta en linea guarda el cliente normal en la base de datos
			$('#warning-message').hide();
			saveCliente(db,true);

		}else{
			//si esta offline
			//no tiene conexion a internet
			$('#warning-message').show();
			showMessage('Cliente guardado en BDD OFFLINE');
			/*OBTENER LOS VALORES DEL FORMULARIO*/
			var object = {};
			formData.forEach(function(value, key){
			    object[key] = value;
			});
			/*FIN OBTENER LOS VALORES DEL FORMULARIOS*/
			/*GUARDAR LOS VALORES OBTENIDOS EN LA TABLA OFFLINE PRESTAMOS*/
			var timestamp =  Date.now();//OBTENER LA FECHA EN TIMESTAMP
			//GUARDAR DATOS EN UN JSON
			object.idcliente = -1;
			object.fecha_cliente = timestamp;
			object.condicion = 1;
			//AÑADIR DATOS A LA TABLA offline
			db.clientes.put(object).catch(function(error) {console.log ("Ooops: " + error);});
			//añadir a la tabla datatable
			$("#idcliente").append("<option value="+object.cedula+">"+object.nombre+"</option>");
			$('#idcliente').selectpicker('refresh');
			cancelarform();
			limpiar();
		}
}

function guardaryeditar(e,db)
{
	e.preventDefault(); //No se activará la acción predeterminada del evento
	//verificar si tiene conexion a internet
		if(navigator.onLine){
			$('#warning-message').hide();

			saveCliente(db,false);

			var contador = 0;
			db['prestamos'].count(function (count) { 
				//verificar que hayan objetos en la tabla prestamo offline
				if(count>0){
					//alert("hay muchos objetos en la tabla offline "+count);
					//iteramos la tabla prestamos offline para luego registrarla a la bdd del servidor
					db.prestamos.each(function (item, cursor) {
					if(item.type==1)//esta registrando
					{
						$.ajax({
						url: "../ajax/prestamos.php?op=insertoffline",
					    type: "POST",
					    data:item,
					    dataType: "json",
					    beforeSend: function(){
        					$("#btnGuardar").prop('disabled', true);
      					}
						})
						.done(function(resp) {
							contador++;
							$("#btnGuardar").prop('disabled', false);
							showMessage(resp.str);
							tabla.ajax.reload();
							/*ELIMINAR EL ITEM DE LA BASE DE DATOS OFFLINE*/
							db.prestamos.where("id").equals(item.id).modify(function(value) {
						    	delete this.value;
							});

				    	})
				    	.fail(function(err,object,name) {
				    		showMessage('Error, Intentelo nuevamente.',true);
				      		console.log(JSON.stringify(err));
				      		$("#btnGuardar").prop('disabled', false);
				    	})
					}else if(item.type==2){//esta editando
						if(item.idprestamo!=-1){
							$("#btnGuardar").prop("disabled",true);

							$.ajax({
								url: "../ajax/prestamos.php?op=guardaryeditar",
							    type: "POST",
							    data: item,
							    success: function(datos)
							    {                    
							    	showMessage('Abonos en cola añadido exitosamente');
							    	$("#btnGuardar").prop('disabled', false);
							    	contador++;
							    	/*ELIMINAR EL ITEM DE LA BASE DE DATOS OFFLINE*/
									db.prestamos.where("id").equals(item.id).modify(function(value) {
								    	delete this.value;
									});
							    }
							});
						}
					}
					if(contador>=count){
							bootbox.alert('Se han añadido los registros que estaban en cola, ya puede guardar este prestamo');	 
							
					}
					});
					

				}else{
					//registrar mediante ajax normalmente
					$("#btnGuardar").prop("disabled",true);

					var formData = new FormData($("#formulario")[0]);
					var cobrado = $("#abonos").val();

					var myRadio = $("input[name=optionsRadios]");
					var checkedValue = myRadio.filter(":checked").val();

					if($("#idprestamo").val()=="")
					{
						var prestado = parseFloat($("#monto").val());
						//updateMontoPrestado(prestado);						
					}


					var index_tabla = tabla.rows().count();
					$.ajax({
						url: "../ajax/prestamos.php?op=guardaryeditar&index_tabla="+index_tabla,
					    type: "POST",
					    data: formData,
					    contentType: false,
					    processData: false,
					    success: function(datos)
					    {   
					    	if(checkedValue=="dia"){
						     	cargarTotal();
							}else{
								aplicarFiltro();
							}                 
					          bootbox.alert(datos);	          
					          mostrarform(false);
					          tabla.ajax.reload();
					          $('html, body').animate({scrollTop:yScroll}, 'slow');
					    }
					});
					limpiar();
				}
			});
		} else {
			//no tiene conexion a internet
			$('#warning-message').show();
			showMessage('Registro guardado en BDD OFFLINE');
			/*OBTENER LOS VALORES DEL FORMULARIO*/
			var formData = new FormData($("#formulario")[0]);
			var object = {};
			formData.forEach(function(value, key){
			    object[key] = value;
			});



			/*FIN OBTENER LOS VALORES DEL FORMULARIOS*/
			/*GUARDAR LOS VALORES OBTENIDOS EN LA TABLA OFFLINE PRESTAMOS*/
			var idprestamo = object.idprestamo ? object.idprestamo : -1;
			var type = object.idprestamo ? 2 : 1;
			var timestamp = Date.now();//OBTENER LA FECHA EN TIMESTAMP
			//GUARDAR DATOS EN UN JSON
			if(id_indexdb_selected!=-1 && idprestamo==-1){type = 1;} 
			var abonos = object.abonos ? object.abonos : 0;
			var cliente = $("#idcliente :selected").text();
			var o = {
				idprestamo:parseInt(idprestamo),
				idcliente: parseInt(object.idcliente),
				monto: parseFloat(object.monto),
				condicion:1,
				monto_total: parseFloat(object.monto_total),
				fecha_prestamo: timestamp,
				type: type,
				cliente: cliente,
				abonos: parseFloat(abonos),
				id_indexdb_selected: id_indexdb_selected
			}
			//AÑADIR DATOS A LA TABLA offline
			if(id_indexdb_selected==-1){
				/*CALCULAR*/
				updateMontoPrestado(parseFloat(object.monto));
				
			
				db.prestamos.put(o).then(function(id){
					if(idprestamo==-1){
					//añadir a la tabla datatable
					addRow(o,id);
					}else{
						//editar la fila de la tabla
						var t = $('#tbllistado').DataTable();
						t.cell(index_selected,4).data($("#monto_total").val()).draw();
					}
					mostrarform(false);
					limpiar();
				}).catch(function(error) {console.log ("Ooops: " + error);});				
			}else{
				updateMontoCobrado(parseFloat(object.abonos));

				console.log('ESTOY EDITANDOOOOO');
				console.log(object);
				db.prestamos.update(id_indexdb_selected, o).then(function (updated) {
				  if (updated){
				  	console.log ("tabla actualizada");
				  	//editar la fila de la tabla
					var t = $('#tbllistado').DataTable();
					t.cell(index_selected,4).data($("#monto_total").val()).draw();
					mostrarform(false);
					limpiar();
				  }
				  else
				    console.log ("Nothing was updated - there were no prestamo with primary key: "+id_indexdb_selected);
				});
			}
			
			
		}

}

function mostrar(idprestamo,index,id_indexdb)
{
	if(id_indexdb)
	{
		id_indexdb_selected = id_indexdb;
	}else{
		id_indexdb_selected = -1;
	}

	index_selected = index;

	yScroll=self.pageYOffset || (document.documentElement.scrollTop+document.body.scrollTop);


					
	var t = $('#tbllistado').DataTable();
	
	/*Mostrar datos de un cliente que fue añadido en modo offline*/
	if(idprestamo==-1 || !navigator.onLine){
		
		var text1 = t.cell( index,  2).data();
		var row = t.row(index).data();
		
		$("#clientename").html(row[3]);
		var value;
		$("#idcliente option").filter(function() {
			if(this.text==text1){
				value = this.value;
			}
		});
		$("#idcliente").val(value);
		$('#idcliente').selectpicker('refresh');

		//t.cell(index,3).data("50000").draw();
		$("#abonos").show();

		$("#abonos").val(0);
		$("#abono_titulo").show();
		$("#tituloidprestamo").show();
		//$("#idprestamo").show();
		$("#listadoabonos").show();
		mostrarform(true,true);
		//obtener el monto
		text1 = t.cell( index,  3).data();
		$("#monto").val(text1);
		//obtener el montototal
		text1 = t.cell( index,  4).data();
		$("#monto_total").val(text1);
		montototal_selected = text1;
		console.log('montototal_selected: '+montototal_selected);
		if(idprestamo==-1){
			idprestamo = -1;
		}
		$("#idprestamo").val(idprestamo);
		listarabonos(idprestamo);
		return;
	}


	/*mostrar datos del cliente*/

	$.post("../ajax/prestamos.php?op=mostrar",{idprestamo : idprestamo}, function(data, status)
	{
		$("#abonos").show();
		$("#abonos").val(0);
		$("#abono_titulo").show();
	//	$("#tituloidprestamo").show();
	//	$("#idprestamo").show();
		$("#listadoabonos").show();

		mostrarform(true,true);

		data = JSON.parse(data);	
		console.log('cedula: '+data.idcliente);
		var row = t.row(index).data();
		$("#direccion").html('<b>Direccion:</b> '+data.direccion);

		$("#clientename").html(row[3]);
		$("#idcliente").val(data.idcliente);
		$('#idcliente').selectpicker('refresh');
		$("#monto").val(data.monto);
		$("#monto_total").val(data.monto_total);
		
 		$("#idprestamo").val(data.idprestamo);
 		$("#monto_total").val(data.monto_total);
		montototal_selected = data.monto_total;

		listarabonos(data.idprestamo);

 	})
}







//Función para desactivar registros
function desactivar(idprestamo)
{
	bootbox.confirm("¿Está Seguro de desactivar el prestamo?", function(result){
		if(result)
        {
        	$.post("../ajax/prestamos.php?op=desactivar", {idprestamo : idprestamo}, function(e){
        		bootbox.alert(e);
	            tabla.ajax.reload();
        	});	
        }
	})
}




//Función para activar registros
function activar(idprestamo)
{
	bootbox.confirm("¿Está Seguro de activar el prestamo?", function(result){
		if(result)
        {
        	$.post("../ajax/prestamos.php?op=activar", {idprestamo : idprestamo}, function(e){
        		bootbox.alert(e);
	            tabla.ajax.reload();
        	});	
        }
	})
}







function sumarentradas()
{   

	
	$( "#abonos" ).keyup(function() {
		var num3=parseInt($('#abonos').val());
		var num1=parseInt($('#monto_total').val());
		//var num2=parseInt($('#monto_abonos').val());
		if(!isNaN(num3)){
			$('#monto_total').val(montototal_selected-num3); 
		}else{
			$('#monto_total').val(montototal_selected); 
		}
		
	  //console.log( "el valor es: "+num3 );
	});

	$( "#monto" ).keyup(function() {
		var num3=parseInt($('#monto').val());
		//var num2=parseInt($('#monto_abonos').val());
		if(!isNaN(num3)){
			var result = num3 * 0.20;
			$('#monto_total').val((num3+result)); 
		}else{
			$('#monto_total').val(0); 
		}
		
	  //console.log( "el valor es: "+num3 );
	});

	/*$('#contenidos').on('change','#monto_total_abonos','#monto_abonos','#abonos',function(){
		var num1=parseint($('#monto_total_abonos').val());
		var num2=parseint($('#monto_abonos').val());
		var num3=parseint($('#abonos').val());
		if(isNaN(num1))
		{
			num1=0;
				
		}

		console.log(num1)


		if(isNaN(num2))
		{
			num2=0;
			
		}
		console.log(num2)

		if(isNaN(num3))
		{
			num3=0;

		}
		console.log(num3)

		$('#resultado').val(num1+num2+num3); 
	})*/
}






init();