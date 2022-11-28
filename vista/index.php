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
                          <h1 class="box-title">BIENVENIDO AL SISTEMA</h1>
                        <div class="box-tools pull-right">
                        </div>
                    </div>
                    <!-- /.box-header -->




                    <!-- centro -->
                    <div class="panel-body table-responsive" id="listadoregistros">
                      <div class="row boxasd">
                        <div class="col-md-12">
                          
                          <div class="col-md-1">
                            <div class="radio">
                            <label>
                              <input type="radio" name="optionsRadios" onclick="init()" id="optionsRadios1" value="option1" checked>
                              Hoy
                            </label>
                          </div>
                          </div>
                          <div class="col-md-1">
                            <div class="radio">
                            <label>
                              <input type="radio" name="optionsRadios" onclick="habilitarFechas(true)" id="optionsRadios2" value="option2">
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
                        <h3 class="boxasd" id="montoCobrado"> Monto Cobrado 0$</h3>
                      </div>
                      <div class="col-md-4">
                        <h3 class="boxasd" id="montoPrestado"> Monto Prestado 0$</h3>
                      </div>
                      <div class="col-md-4">
                        <h3 class="boxasd"> Monto Total Por Cobrar 0$</h3>
                      </div>
                      </div>
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

<script type="text/javascript" src="scripts/index.js"></script>