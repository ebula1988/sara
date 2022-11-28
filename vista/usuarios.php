<?php
require 'header.php';
?>
<!--Contenido-->
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">        
        <!-- Main content -->
        <section class="content">
            <div class="row">
              <div class="col-md-12">
                  <div class="box">
                    <div class="box-header with-border">
                          <h1 class="box-title">LISTADO DE USUARIOS <button class="btn btn-success" id="btnagregar" onclick="mostrarform(true)"><i class="fa fa-plus-circle"></i> Nuevo</button></h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                    <!-- /.box-header -->




                    <!-- centro -->
                    <div class="panel-body table-responsive" id="listadoregistros">
                        <table id="tbllistado" class="table table-striped table-bordered table-condensed table-hover">
                          <thead>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Nivel Administrativo</th>
                            <th>Fecha Registro</th>
                            <th>Status</th>
                            <th>Opciones</th>
                          </thead>
                          <tbody>                            
                          </tbody>

                        </table>
                    </div>



                    <div class="panel-body" style="height: 100%; display: none !important;" id="formularioregistros">
                        <form name="formulario" id="formulario" method="POST" novalidate>
                         
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Usuario:</label>
                            <input type="hidden" name="idusuario" id="idusuario">
                            <input type="text" class="form-control" name="usuario" id="usuario" maxlength="50" placeholder="Ingrese el usuario" required autofocus>
                          </div>

                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id="bloqueClave">
                            <label id="tit_clave">Clave:</label>
                            <input type="password" class="form-control" name="clave" id="clave" minlength=8 maxlength="50" placeholder="Min 8 Caracteres" required>
                          </div>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id="bloqueCorreo">
                            <label>E-mail:</label>
                            <input type="email" class="form-control" name="correo" id="correo" maxlength="50" placeholder="Ingrese el E-mail" required >
                          </div>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Nivel Administrativo:</label>
                            <select class="form-control" id="id_nivel_adm" name="id_nivel_adm">
                            <option value="0">Cobrador</option>
                            <option value="1">Administrador</option>
                          </select>
                          </div>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Ruta:</label>
                            <select class="form-control" id="idruta" name="idruta">
                          </select>
                          </div>

                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button class="btn btn-primary" type="submit" id="btnGuardar"><i class="fa fa-save"></i> Guardar</button>
                            <button class="btn btn-danger" onclick="cancelarform()" type="button" id="btnCancelar"><i class="fa fa-arrow-circle-left"></i> Cancelar</button>
                            <button style="display: none;" id="btnEdicarClave" class="btn btn-warning" onclick="mostrarClaveForm()" type="button"><i class="glyphicon glyphicon-pencil"></i> Editar Clave</button>
                          </div>
                        </form>
                         <form name="formularioclave" id="formularioclave" method="POST" style="display: none;">

                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id="bloqueClave">
                            <label id="tit_clave">Nueva Clave:</label>
                            <input type="hidden" name="idusuarioclave" id="idusuarioclave">
                            <input type="password" class="form-control" name="guardar_clave" id="guardar_clave" minlength=8 maxlength="50" placeholder="Min 8 Caracteres" required>
                          </div>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id="bloqueClave">
                            <label id="tit_clave">Confirmar Clave:</label>
                            <input type="password" class="form-control" name="conf_clave" id="conf_clave" minlength=8 maxlength="50" placeholder="Min 8 Caracteres" required>
                          </div>

                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button class="btn btn-primary" type="submit" id="btnGuardarClave"><i class="fa fa-save"></i> Guardar Clave</button>
                            <button class="btn btn-danger" onclick="cancelarClave()" type="button"><i class="fa fa-arrow-circle-left"></i> Cancelar</button>
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

<script type="text/javascript" src="scripts/usuarios.js"></script>