function calcular(btn){	
		//btn.addEventListener("click", function(e) {    
		//	e.preventDefault();  
			
			var erros = 0; 
			var sat_atual =0.0;
			
			var ca = $('#ca').val().replace(",","."); //calcio desejado
			if(ca < 50 || ca > 65){
				$('#ca').addClass('erro');
				alert("Valor inválido. % de cálcio deve estar entre 50 e 65");
				erros+=1;
			}else{$('#ca').removeClass('erro');}
			
			var mg = $('#mg').val().replace(",",".");
			if(mg < 10 || mg > 20){
				$('#mg').addClass('erro');
				alert("Valor inválido. % de magnésio deve estar entre 10 e 20");
				erros+=1;
			}else{$('#mg').removeClass('erro');}
			
			var k = $('#k').val().replace(",",".");
			if(k < 3 || k > 5){
				$('#k').addClass('erro');
				alert("Valor inválido. % de potássio deve estar entre 3 e 5");
				erros+=1;
			}else{$('#k').removeClass('erro');}
			
			var ca_a= $('#ca_atual').val().replace(",","."); // niveis da analise
			if(ca_a <= 0){
				$('#ca_atual').addClass('erro');
				alert("Valor inválido. Cálcio da análise deve ser maior que 0");
				erros+=1;
			}else{$('#ca_atual').removeClass('erro');}
			
			var mg_a = $('#mg_atual').val().replace(",",".");
			if(mg_a <= 0){
				$('#mg_atual').addClass('erro');
				alert("Valor inválido. Magnésio da análise deve ser maior que 0");
				erros+=1;
			}else{$('#mg_atual').removeClass('erro');}
			
			var k_a = $('#k_atual').val().replace(",",".");
			if(k_a <= 0){
				$('#k_atual').addClass('erro');
				alert("Valor inválido. Potássio da análise deve ser maior que 0");
				erros+=1;
			}else{$('#k_atual').removeClass('erro');}
			
			var ctc = $('#ctc').val().replace(",",".");
			if(ctc <= 0){
				$('#ctc').addClass('erro');
				alert("Valor inválido. CTC da análise deve ser maior que 0");
				erros+=1;
			}else{$('#ctc').removeClass('erro');}
			
			var ox_ca = $('#oxido_ca').val().replace(",",".");
			if(ox_ca <= 0){
				$('#oxido_ca').addClass('erro');
				alert("Valor inválido. Valor do Cálcio presente no calcário será considerado valor médio");
				ox_ca = 35;				
			}else{$('#oxido_ca').removeClass('erro');}
			
			var ox_mg =$('#oxido_mg').val().replace(",",".");
			if(ox_mg <= 0){
				$('#oxido_mg').addClass('erro');
				alert("Valor inválido. Valor de Magnésio presente no calcário será considerado valor médio");
				if($('#dolom').is(':checked')){
					ox_mg = 25;
				}					
				if($('#calcit').is(':checked')){
					ox_mg = 5;
				}									
			}else{
				$('#oxido_mg').removeClass('erro');
				
				
			}			
			if(erros>0){
				return;
			}
			
			
			
			//calcula o nivel ideal necessario para atingir valor baseado na informação do usuario Cmol/dm³
			ca_ideal = ((ca/100)*ctc) - ca_a; 
			//alert("faltam "+ca_ideal+" cmol de Ca");
			mg_ideal = ((mg/100)*ctc) - mg_a;
			k_ideal = ((k/100)*ctc) - k_a;
			
			sat_atual = ((ca_a*100)/ctc) + ((mg_a*100)/ctc) + ((k_a*100)/ctc);
			
			// 1 Cmolc de calcio equivale a 200,4mg/dm³ de Calcio ( Ca )
			ca_ideal = ca_ideal*200.4; //mg/dm³
			ca_ideal = ca_ideal*2; // converte mg/dm³ em kg/hectare de Ca
			//alert("faltam "+ca_ideal+" kg/hectare de Ca");
			// transformar calcario (oxido de calcio)em Ca
			ca_ton = ca_ideal / 0.71428;
			// multiplica-se a percentagem de oxido de calcio do calcario por 0,71438			
			calcio = (ca_ton*100)/ox_ca;
			calcio = calcio.toFixed(2);
			
			
			// calculo de magnesio
			// fonte: https://agronomiacomgismonti.blogspot.com/2013/04/fatores-de-conversao-de-magnesio-em.html
			// 1 Cmolc de Magnesio equivale a 0,12156g de Magnésio ( Mg ) transformar g em mg,multiplicar gramas por 1000
			if(mg_ideal > 0){
				mg_ideal = mg_ideal*121.56; // mg/dm³ ou 0,12156*1000	
				mg_ideal = mg_ideal*2; //converte mg/dm³ em kg/hectare de Mg
				
				// transformar Mg em MgO multiplica-se a qtd mg por 1,6584
				// multiplica-se a percentagem de oxido de magnesio do calcario por 0,6030
				mg_ton = mg_ideal * 1.6584
				magnesio = (mg_ton*100)/ox_mg;
				magnesio = magnesio.toFixed(2);
			}else{
				magnesio = 0;
			}
			
			// calculo de potassio
			// fonte: https://agronomiacomgismonti.blogspot.com/2012/08/converter-cmolc-de-k-ca-mg-e-na-em-mgdm.html
			// 1 Cmolc potássio equivale a 391mg/dm³ de potássio (K).
			if(k_ideal >0){
				k_ideal = k_ideal*391;
				
				//1 kg/ha de K equivale à 1,20458 kg/ha de K2O
				potassio = (k_ideal*2)*1.20458;
				potassio = potassio.toFixed(2);
				
			}else{
				potassio = 0;
			}
			var porcentagem_mg = 0;
			var porcentagem_mg_dolomit = 0; //compara o nivel de magnesio com um calcario dolomitico
			var cmol_mg = 0;
			var tipo = "";
			var calcario = 0;
					
			//compara as quantidades de calcario para Ca e Mg
			//transforma o mg e ca em porcentagem
			
			//transforma a quantidade de calcario em % magnesio
			porcentagem_mg = dolomitico(magnesio, ox_mg, mg_a, ctc);			
			porcentagem_mg_dolomit = dolomitico(calcio, ox_mg, mg_a, ctc);
			
			//	porcentagem_mg = magnesio * (ox_mg / 100); //mgo total aplicado
			//	porcentagem_mg = (porcentagem_mg*4.9628);  //1 g MgO em cmolc = 1 / 0,2015 g = 4,9628
			//	porcentagem_mg = (porcentagem_mg/1000)/2;  //converte em cmol/dm³= x/1000 e reorna dos hectares = x/2
				//porcentagem_mg = (porcentagem_mg*0.02481);// calculo direto --- converte oxido de magnesio (MgO) em magnesio(Mg) cmolc/dm3 = A x 0,02481
			//	porcentagem_mg = (porcentagem_mg + parseFloat(mg_a)) * 100; // soma com o Mg atual e calcula porcentagem
			//	porcentagem_mg = (porcentagem_mg/ctc).toFixed(2)
			
			//transforma a quantidade de calcario em % de calcio
			porcentagem_ca = calcitico(calcio, ox_ca, ca_a, ctc);
			//		porcentagem_ca = calcio * (ox_ca / 100);// total de oxido de calcio adicionado
			//		porcentagem_ca = porcentagem_ca / 1.4; // transforma oxido de calcio (CaO) em Cálcio (Ca)
			//		porcentagem_ca = porcentagem_ca / 2;  // transforma kg/ha de Ca em mg/dm³ de Ca
			//		porcentagem_ca = porcentagem_ca / 200.4; //Transformar mg/dm³ em cmolc/dm³
			//		porcentagem_ca = porcentagem_ca + ca_a * 1; //soma os cmolc/dm³ da analise com o adicionado pelo calcario
			//		porcentagem_ca = ((porcentagem_ca*100)/ctc).toFixed(2); //calcula a porcentagem em relação a CTC
			
			
			//if((calcio >= magnesio && ox_mg <=5) || porcentagem_ca < 65 && porcentagem_mg <=20){
			if(ox_mg <= 5 && mg_ideal>0 || ox_ca < 1){	
					tipo="Calcítico";  // calcitico é preto
					calcario = calcio;
					porcentagem_mg = dolomitico(calcario, ox_mg, mg_a, ctc);
			
			}else{
				tipo="Dolomítico";//dolomitico é branco
				calcario = magnesio;
				porcentagem_ca = calcitico(calcario, ox_ca, ca_a, ctc);
			}
				
			var saturacao = 0;
			var sat_alc = 0;
			saturacao = parseInt(ca) +  parseInt(mg) +  parseInt(k); 
			sat_alc = parseInt(porcentagem_ca)+parseInt(porcentagem_mg)+parseInt(k);
			
			var info="";
			var erro_calcio =""; 
			if(mg_ideal<=0){
				info ='<div class=" col-12"> <h5 class="mb-12" id="txt_mg" style="color: red;"> Saturação por Magnésio pretendida ('+mg+'%) é menor que a saturação atual '+porcentagem_mg+'% .</h5></div>';
			}
			if(porcentagem_ca >65){
				erro_calcio = '<div class=" col-12"> <h5 class="mb-12" style="color: red;">Saturação por Cálcio muito alta = '+porcentagem_ca+'%.  </h5></div>';
			}
				
			document.getElementById('resultado').innerHTML=	'<div class=" col-12">	<hr class="hr3">'+
					'<h5 class="tm-section-title mb-3">Resultado processado</h5> </div>'+
					
				'<div class=" col-12"> <h5 class="mb-12">Correção por cálcio '+calcio+'kg/ha <> Correção por magnésio '+magnesio+'kg/ha.  </h5></div>'+
				'<div class=" col-12"> <h5 class="mb-12">Recomendação de '+calcario+' Kg/ha de calcário '+tipo+'.  </h5></div>'+
				
				'<div class=" col-12"> <h5 class="mb-12"> Saturação  pretendida  Ca + Mg + K = '+saturacao+'%.  Atual = '+sat_atual.toFixed(2)+'%.</h5></div>'+
				'<div class=" col-12"> <h5 class="mb-12">Saturação alcançada após correção = '+sat_alc+'%.  </h5></div>'+
				
				'<div class=" col-12"> <h5 class="mb-12" id="txt_mg"> Saturação futura: Cálcio '+porcentagem_ca+'%; Magnésio '+porcentagem_mg+'%. </h5></div>'+
				erro_calcio+
				info+
				'<div class=" col-12"> <h5 class="mb-12" id="txt_mg"> Potássio: '+potassio+'Kg/ha de K2O ou '+(((potassio*100)/60)/50).toFixed(1)+' sacas/ha (50kg) de cloreto de potássio. </h5></div>';
				
				
			//$('#txt_ca').ad
		//});
	}
	
	function calcitico(calcario, ox_ca, ca_a, ctc){ //Dolomítico é branco
		porcentagem_ca = calcario * (ox_ca / 100);// total de oxido de calcio adicionado
		porcentagem_ca = porcentagem_ca / 1.4; // transforma oxido de calcio (CaO) em Cálcio (Ca)
		porcentagem_ca = porcentagem_ca / 2;  // transforma kg/ha de Ca em mg/dm³ de Ca
		porcentagem_ca = porcentagem_ca / 200.4; //Transformar mg/dm³ em cmolc/dm³
		porcentagem_ca = porcentagem_ca + ca_a * 1; //soma os cmolc/dm³ da analise com o adicionado pelo calcario
		porcentagem_ca = ((porcentagem_ca*100)/ctc).toFixed(2); //calcula a porcentagem em relação a CTC
		return porcentagem_ca;
	}
	
	function dolomitico(calcario, ox_mg, mg_a, ctc){
		porcentagem_mg = calcario * (ox_mg / 100); //mgo total aplicado
		porcentagem_mg = (porcentagem_mg*4.9628);  //1 g MgO em cmolc = 1 / 0,2015 g = 4,9628
		porcentagem_mg = (porcentagem_mg/1000)/2;  //converte em cmol/dm³= x/1000 e reorna dos hectares = x/2
		//porcentagem_mg = (porcentagem_mg*0.02481);// calculo direto --- converte oxido de magnesio (MgO) em magnesio(Mg) cmolc/dm3 = A x 0,02481
		porcentagem_mg = (porcentagem_mg + parseFloat(mg_a)) * 100; // soma com o Mg atual e calcula porcentagem
		porcentagem_mg = (porcentagem_mg/ctc).toFixed(2);
		return porcentagem_mg;
	}