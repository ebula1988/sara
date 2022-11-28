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
        console.log("request failed");
     })
     .always(function() {
       $("#btnLogin").prop('disabled', false);
     });

}