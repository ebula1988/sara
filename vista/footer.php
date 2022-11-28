    <footer class="main-footer">
        <div class="pull-right hidden-xs">
          <b>Version</b> 2.3.0
        </div>
        <strong>Copyright &copy; 2019 <span id="nombreEmpresa"></span>.</strong> Todos los derechos reservados.
    </footer>    
    <!-- jQuery -->
    <script src="../public/js/jquery-3.1.1.min.js"></script>
    <!-- Bootstrap 3.3.5 -->
    <script src="../public/js/bootstrap.min.js"></script>
    <!-- AdminLTE App -->
    <script src="../public/js/app.min.js"></script>
    
    <script type="text/javascript" src="scripts/footer.js"></script>

    <!-- DATATABLES --> 
    <script src="../public/datatables/jquery.dataTables.min.js"></script>    
    <script src="../public/datatables/dataTables.buttons.min.js"></script>
    <script src="../public/datatables/buttons.html5.min.js"></script>
    <script src="../public/datatables/buttons.colVis.min.js"></script>
    <script src="../public/datatables/jszip.min.js"></script>
    <script src="../public/datatables/pdfmake.min.js"></script>
    <script src="../public/datatables/vfs_fonts.js"></script> 

    <script src="../public/js/bootbox.min.js"></script> 
    <script src="../public/js/bootstrap-select.min.js"></script>  
    <script src="scripts/sweetalert2.min.js"></script>
    <script type="text/javascript" src="scripts/bootstrap-datepicker.min.js"></script>
    
    <script languaje="javascript">
        function sumar()
        {
            var total=0;
            var monto_abonos=document.getelementbyid("monto_abonos")
            var monto_total_abonos=document.getelementbyid("monto_total_abonos")
            total.value=parseint(monto_abonos)+ parseint(monto_total_abonos);

            var resultado=document.getelementbyid("resultado");
            display.innerhtml=total;


    }


    </script>
  </body>
</html>