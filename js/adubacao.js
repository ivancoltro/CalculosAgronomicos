function adubar(){
	var cultura = $('#cultura').val();
	var nitro = $('#n').val();
	var fosf = $('#p2o5').val();
	var potas = $('#k2o').val();
	var produtividade = $('#producao').val().replace(",",".");
	var metodo = $('#extracao').is(':checked');
	
	var err = 0;
	var txt_metodo="";
	
	if(cultura == ""){
		$('#msg_cultura').removeClass('esconde');
		$('#cultura').addClass('erro');
		err +=1;
	}
	
	if(nitro <0){
		$('#msg_formulacao').removeClass('esconde');
		$('#n').addClass('erro');
		err +=1;
	}
	
	if(fosf <=0){
		$('#msg_formulacao').removeClass('esconde');
		$('#p2o5').addClass('erro');
		err +=1;
	}
	
	if(potas <=0){
		$('#msg_formulacao').removeClass('esconde');
		$('#k2o').addClass('erro');
		err +=1;
	}
	
	if(produtividade <=0 || (cultura == "soja" && produtividade > 6) || (cultura == "milho" && produtividade > 12) || (cultura == "trigo" && produtividade > 6)){
		$('#msg_producao').removeClass('esconde');
		$('#producao').addClass('erro');
		err +=1;
	}
	
	if(err > 0){
		return;
	}
	
	let quantidadefertilizante = [];
	if(cultura == "soja"){
		// [N, P, K, adicional N, adicional P, adicional k]
		if(!metodo){
			quantidadefertilizante = soja_ex(fosf, potas, produtividade);
		}else			
			quantidadefertilizante = soja(fosf, potas, produtividade);
		
	}
	
	if(cultura == "milho"){
		if(!metodo){
			quantidadefertilizante = milho_ex(nitro, fosf, potas);
		}else			
			quantidadefertilizante = milho(nitro, fosf, potas);
	}
	if(cultura == "trigo"){
		if(!metodo){
			quantidadefertilizante = trigo_ex(nitro, fosf, potas);
		}			
			quantidadefertilizante = trigo(nitro, fosf, potas);
	}
	
	var add_n=""; var add_p=""; var add_k = "";
	if(quantidadefertilizante[3]>0){// nitrogenio
		
	}
	if(quantidadefertilizante[4]>0){// fosforo
		
	}
	if(quantidadefertilizante[5]>0){ //potassio
		add_k = '<div class=" col-12"> <h5 class="mb-12">Complementação com '+quantidadefertilizante[5].toFixed(1)+' Kg/ha de cloreto de potásio.  </h5></div>';
	}
	
	if(metodo){
		txt_metodo = "EXTRAÇÃO";
	}else{
		txt_metodo = "EXPORTAÇÃO";
	}
	
	/*document.getElementById('resultado_adubacao').innerHTML= '<div class=" col-12">'+
																'<table sty>'+
																	'<tr>'+
																		'<th>Aduba?</th>'+
																		'<th>Quantidade</th>'+																		
																	'</tr>'+
																	'<tr>'+
																		'<td>'+nitro+' - '+fosf+' - '+potas+'</td>'+
																		'<td>'+quantidadefertilizante[1].toFixed(2)+' Kg/ha</td>'+
																	'</tr>'+																	
																'</table>'+
															'</div>';*/
	
	document.getElementById('resultado_adubacao').innerHTML=	'<div class=" col-12">	<hr class="hr3">'+
					'<meta charset="UTF-8">'+
					'<h5 class="tm-section-title mb-3">Adubação Calculada pela '+txt_metodo+'</h5> </div>'+
					
				'<div class=" col-12"> <h5 class="mb-12">Para a Formulação '+nitro+' - '+fosf+' - '+potas+'.  </h5></div>'+
																		// [N, P, K, adicional N, adicional P, adicional k]
				'<div class=" col-12"> <h5 class="mb-12">Recomendação de '+quantidadefertilizante[1].toFixed(2)+' Kg/ha.  </h5></div>'+
				add_n + add_p + add_k +
				'<div class=" col-12"> <h5 class="mb-12" style="color: red;"> Atente-se para que a quantidade de FOSFORO esteja acima do nível crítico.</h5></div>';
				
}

//ex  75sc/ha= 181,5sc/alq  = 4500kg/ha		4,5x16,7=75,15 kg/p			375,75kg de 2-20-20		  
function soja(p, k, produtividade){	
	var ad_p=0; var ad_k=0; var adicional_k =0;		// fonte https://blog.agromove.com.br/adubacao-altas-produtividades-soja/	
	ad_p = produtividade * 16.7;	// 16,7 kg p por tonelada produzida
	ad_k = produtividade * 40.8;  // 183,6 kg de K
	sc_p = ((ad_p * 100) / p); 
	sc_k = ((ad_k * 100) / k); // K=% de K no adubo      918 kg para 4,5 ton
	
	if(sc_k>sc_p){
		adicional_k = ad_k - (sc_p * (k/100));	// forneceu 75,15. falta 108,45kg de k
		adicional_k = adicional_k/0.6;	// calcula a quantidade de cloreto
		//padr?do vetor de retorno
		// N, P, K, adicional N, adicional P, adicional k
		return [0, sc_p, 0, 0, 0, adicional_k];
		
	}else{
		return [0, sc_p, 0, 0, 0, 0];;
	}
	
}

function soja_ex(p, k, produtividade){
	var ad_p=0; var ad_k=0; var adicional_k =0;				// fonte https://blog.agromove.com.br/adubacao-altas-produtividades-soja/
	ad_p = produtividade * 13;	// metodo da exportação
	ad_k = produtividade * 24;  // 
	sc_p = ((ad_p * 100) / p); 
	sc_k = ((ad_k * 100) / k); // 
	
	if(sc_k>sc_p){
		adicional_k = ad_k - (sc_p * (k/100));	// forneceu 75,15. falta 108,45kg de k
		adicional_k = adicional_k/0.6;	// calcula a quantidade de cloreto
		//padr?do vetor de retorno
		// N, P, K, adicional N, adicional P, adicional k
		return [0, sc_p, 0, 0, 0, adicional_k];
		
	}else{
		return [0, sc_p, 0, 0, 0, 0];;
	}
	
}


function milho(){
	return;
}

function trigo(){
	return;
}

function limpaErro(id, msg){
	$('#'+id).removeClass('erro');
	if(msg == null){
		$('#msg_'+id).addClass('esconde');
	}else{
		$('#'+msg).addClass('esconde');
	}
		
}