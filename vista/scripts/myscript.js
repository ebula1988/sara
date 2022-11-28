$(document).on('ready',constructor);
function constructor()
{
	sumarentradas();


}


function sumarentradas()
{
	$('#formularioregistros_abonos').on('change','#valor1','#valor2','#valor3',function(){
		var num1=parseint($('#valor1').val());
		var num2=parseint($('#valor2').val());
		var num3=parseint($('#valor3').val());
		if(isNaN(num1))
		{
			num1=0;
		}
		if(isNaN(num2))
		{
			num2=0;
		}

		if(isNaN(num3))
		{
			num3=0;
		}

		$('#total').val(num1+num2+num3); 
	})
}