function login_ajax(user,pass){

  $.ajax({
       url: '../ajax/usuarios.php',
       type: 'POST',
       dataType: 'json',
       data: {
          "user":user,
          "pass":pass,
          "r"   :"loguear"
        },
       beforeSend: function(){
         $("#btnLogin").prop('disabled', true);
       }
     })
     .done(function(resp) {
       if(!resp.estatus){
         swal(
           'Oops...',
          resp.error,
           'error'
         )
       }else{
           createDB();
           swal(
             'Exito',
             'te has logueado exitosamente',
             'success'
           ).then(function (){
              location.reload();
           }, function (dismiss) {

           if (dismiss === 'overlay') {
              location.reload();
           }
         })
       }//fin else
     })
     .fail(function(err,object,name) {
      console.log(err);
        console.log("request failed");
     })
     .always(function() {
       $("#btnLogin").prop('disabled', false);
     });

}
function createDB()
{
  
  //instansciamos la bdd
  Dexie.exists('ebula').then(function (exists) {
  //añadirlas al indexeddb
  if (exists) {
   /* console.log('existe la base de datos');
      Dexie.delete('ebula').then(() => {
        console.log("Database successfully deleted");
      }).catch((err) => {
        console.error("Could not delete database");
      }).finally(() => {});*/
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

}