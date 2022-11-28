$( document ).ready(function() {
  $.fn.datepicker.defaults.format = "yyyy/mm/dd";
  $('.datepicker').datepicker({
      startDate: '-3d'
  });

  init();

});
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
function aplicarFiltro(){
	var desde = $('#desde').val() 
	var hasta = $('#hasta').val();
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
      
      var monto = (!resp.monto) ? 0 : resp.monto;

      $("#montoPrestado").html("Monto Prestado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });

}
function init(){
  habilitarFechas(false)
  var desde = getDate();
  var hasta = getTomorrow();
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
      var monto = (!resp.monto) ? 0 : resp.monto;
      $("#montoPrestado").html("Monto Prestado "+monto+"$");
     })
     .fail(function(err,object,name) {
        console.log("request failed");
     })
     .always(function() {
       $("#btnAplicar").prop('disabled', false);
     });
}