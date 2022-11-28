<?php
  if(!isset($_COOKIE['user'])){
    header("Location: login.php");
  }  
?>
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
                                                <!-- centro -->
                      <div class="panel-body table-responsive" id="panelMontos">
                      <div class="row boxasd" <?php 
                            if ( $_COOKIE['nivel_adm'] == 0 ) echo 'style="display:none;"'; ?>>
                        <div class="col-md-12">
                          
                          <div class="col-md-1">
                            <div class="radio">
                            <label>
                              <input type="radio" name="optionsRadios" onclick="cargarTotal()" id="optionsRadios1" value="dia" checked>
                              Hoy
                            </label>
                          </div>
                          </div>
                          <div class="col-md-1">
                            <div class="radio">
                            <label>
                              <input type="radio" name="optionsRadios" onclick="habilitarFechas(true)" id="optionsRadios2" value="periodo">
                              Periodo
                            </label>
                          </div>
                          </div>
                          <div class="col-md-3">
                            <div class="input-group date" data-provide="datepicker">
                                <input type="text" class="form-control" id="desde" disabled placeholder="Desde" data-date-format="yyyy/mm/dd">
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="input-group date" data-provide="datepicker">
                                <input type="text" class="form-control" disabled id="hasta" placeholder="Hasta">
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div>
                          </div>    
                          <div class="col-md-1">
                            <button class="btn btn-default" id="btnAplicar" disabled onclick="aplicarFiltro()"><b>Aplicar</b> <span class="glyphicon glyphicon-th" ></span></button>
                          </div>                      
                        </div>

                      </div>
                      <div class="row">
                       
                      <div class="col-md-4">
                        <h3 class="boxasd" id="montoCobrado" style="cursor: pointer;" onclick="filtrarClientes(2)"> Monto Cobrado 0$</h3>
                      </div>
                      <div class="col-md-4">
                        <h3 class="boxasd" id="montoPrestado" style="cursor: pointer;" onclick="filtrarClientes(1)">  Monto Prestado 0$</h3>
                      </div>
                      <?php  
                      if ( $_COOKIE['nivel_adm'] > 0 ) {
                        echo '<div class="col-md-4">
                        <h3 class="boxasd" id="montoxPagar"> Monto Por Cobrar 0$</h3>
                        </div>' ;
                      }
                      ?>
                      
                      </div>
                    </div>

                </div>
              </div>
            </div>
            <div class="row" id="seccionResultado" style="display: none;">
              <div class="col-md-12">
                  <div class="box">
                    <h3 style="text-align: center;" id="tituloResultado"></h3>
                    

                    <table role="table" id="tabla_reclientes" class=" tabla_reclientes table table-striped table-bordered table-condensed table-hover">
                          <thead role="rowgroup">
                            <tr role="row">
                                <th role="columnheader" class="fecha_prestamo">Fecha</th>
                                <th role="columnheader" class="cliente">Cliente</th>
                                <th role="columnheader" class="monto">Monto</th>
                            </tr>
                          </thead>
                          <tbody role="rowgroup">  
                             

                          </tbody>

                        </table>
                        <div class="row">
                          <button style="float: left; margin-left: 20px;" class="btn btn-danger" onclick="volver()" type="button"><i class="fa fa-arrow-circle-left"></i>Volver</button>
                        </div>
                        

                  </div>
              </div>
              
            </div>
            

                          <?php 
                            if ( $_COOKIE['nivel_adm'] == 0 ){
                              echo 
                              '<div class="box">'.
                              '<div class="box-header with-border">'.

                              '<button class="btn btn-success ir-arriba" id="btnagregar" onclick="mostrarform(true)"><i class="fa fa-plus-circle"></i> Agregar prestamo</button>'.'<button class="btn btn-success" id="btnagregar" onclick="mostrarform(true)"><i class="fa fa-plus-circle"></i> Agregar prestamo</button>'.
                              '<button class="btn btn-danger" id="btnagregar" onclick="abrirFrmCliente()"><i class="fa fa-plus-circle"></i> Cliente Nuevo</button>'.'<button class="btn btn-warning" id="btnrefresh" onclick="refresh()"><i class="glyphicon glyphicon-refresh"></i> Actualizar Sistema</button>'.'<button class="btn btn-primary"><i class="glyphicon glyphicon-download"></i> <a href="file.php?file=sara.apk" target=”_blank”>Descargar App</a></button>'.
                              '</div>  </div>  '
                              ;
                            }
                          ?>
                    

            <div class="row" id="seccionPrestamos">
              <div class="col-md-12">
                  <div class="box">
                    


                    <!-- /.box-header -->
                    <!-- centro -->
                    <div class="panel-body table-responsive"  id="listadoregistros">
                      <div id = "warning-message" class="alert alert-danger" role="alert" style="display: none;">
                        <h4><i class="fa fa-warning"></i> Trabajando sin conexión, por favor no cierre ni actualice el sistema.</h4>
                      </div>
                        <table role="table" id="tbllistado" class=" tbllistado table table-striped table-bordered table-condensed table-hover">
                          <thead role="rowgroup">
                            <tr role="row">
                                <th role="columnheader" class="opciones">Opciones</th>
                                <th role="columnheader" class="posicion">Posición</th>
                                <th role="columnheader" class="fecha_prestamo">fecha_prestamo</th>
                                <th role="columnheader" class="cliente">Cliente</th>
                                <th role="columnheader" class="monto">monto prestado</th>
                                <th role="columnheader" class ="montoxpagar">monto x pagar</th>
                            </tr>
                          </thead>
                          <tbody role="rowgroup">  
                             

                          </tbody>

                        </table>




                    </div>


                    <div class="panel-body" id="formularioregistros" style="display: none;">
                      
                        <form name="formulario" id="formulario" method="POST">
                          <b><h2 id="clientename">cargando...</h2></b>
                          <h4 id="direccion">Dirección: N/A</h4>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label id="tituloidprestamo">prestamo cliente ebula(*):</label>
                            <input  name="idprestamo"  id="idprestamo">
                          </div>


                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id="listClientes">
                            <label>Cliente (*):</label>
                            <select id="idcliente" name="idcliente"" class="form-control selectpicker" data-live-search="true"></select>
                          </div>


                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>monto:</label>
                            <input type="number" class="form-control" name="monto"  id="monto" required>
                          </div>


                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>monto total:</label>
                            <input type="number" class="form-control" name="monto_total" id="monto_total" required step=".01">
                          </div>


                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label id="abono_titulo">monto abonar:</label>
                            <input type="number" class="form-control"  name="abonos" id="abonos" >
                          </div>


  

                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button class="btn btn-primary" type="submit" id="btnGuardar"><i class="fa fa-save"></i> Guardar</button>


                            <button class="btn btn-danger" onclick="cancelarform()" type="button"><i class="fa fa-arrow-circle-left"></i> Cancelar</button>
                          </div>

                        </form>


                       

                    
                    </div>
                    <div class="container" id="listadoabonos" style="display: none;">
                    <div class="row justify-content-center">
                        <hr>
                        
                          <div class="col-md-12">
                          <h4>Abonos realizados a este prestamo</h4>
                          <div class="panel-body table-responsive" >
                          <table role="table" id="tblabonos" class=" tblabonos table table-striped table-bordered table-condensed table-hover">
                            <thead role="rowgroup">
                              <tr role="row">
                                  <th role="columnheader" >Opciones</th>
                                  <th role="columnheader" >Numero</th>
                                  <th role="columnheader" >Monto</th>
                                  <th role="columnheader" >Fecha Abono</th>
                              </tr>
                            </thead>
                            <tbody role="rowgroup">  
                               
                            </tbody>
                          </table>
                          </div>                        
                          </div>  

                    </div>                      
                    </div>


                    <div class="panel-body" style="display: none;" id="formularioclientes">
                      <h4>Agregar Nuevo Cliente</h4>
                        <form name="formulario" id="formularioCliente" method="POST">
                         
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Nombre:</label>
                            <input type="hidden" name="idcliente" id="idcliente">
                            <input type="text" class="form-control" name="nombre" id="nombre" maxlength="50" placeholder="Nombre" required>
                          </div>
                          <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label>Cedula:</label>
                            <input type="number" class="form-control" name="cedula" id="cedula" maxlength="50" placeholder="Cedula" required>
                          </div>
                         

                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button class="btn btn-primary" type="submit" id="btnGuardarCliente"><i class="fa fa-save"></i> Guardar</button>

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

<script type="text/javascript" src="scripts/prestamos.js"></script>
<script type="text/javascript" src="scripts/moment.js"></script>
<script type="text/javascript" src="scripts/bootstrap-notify.js"></script>


