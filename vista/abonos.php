
<?php
require 'header.php';
?>


 <div class="content-wrapper">        
        <!-- Main content -->
        <section class="content">
            <div class="row">
              
                    <!-- /.box-header -->




                    <!-- centro -->
                    


                    <div class="panel-body" style="height: 400px;" id="formularioregistros">
                        <form name="formulario" id="formulario" method="POST">
                         
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Nombre:</label>
                            <input type="hidden" name="idcliente" id="idcliente">
                            <input type="text" class="form-control" name="nombre" id="nombre" maxlength="50" placeholder="Nombre" required>
                          </div>


                            <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>monto_total:</label>
                           
                            <input type="text" class="form-control" name="monto_total" id="monto_total" maxlength="50" placeholder="Nombre" required>
                          </div>

                         

                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button class="btn btn-primary" type="submit" id="btnGuardar"><i class="fa fa-save"></i> Guardar</button>

                            <button class="btn btn-danger" onclick="cancelarform()" type="button"><i class="fa fa-arrow-circle-left"></i> Cancelar</button>
                          </div>
                        </form>
                    </div>
                   
                    <!--Fin centro -->
                  </div><!-- /.box -->
              </div><!-- /.col -->
          </div><!-- /.row -->
      </section><!-- /.content -->

    </div><!-- /.content-wrapper -->
  <!--Fin-Contenido-->
<?php
require 'footer.php';
?>
