var dist = 10;
var lat = 48.85;
var lon = 2.35;

calcul();
var tab = calculParkingInit();

function calculParking(tab){
	dist = document.getElementById("dist").value;
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	var len = tab.length;
	var min = Infinity;
	var tmp;
	var indice = 0;
	for(var i = 1; i < len; i++){
		tmp = (parseFloat(tab[i][18])-lon)**2 + (parseFloat(tab[i][19])-lat)**2;
		if (tmp < min){
			min = tmp;
			indice = i;
		}
	}
	console.log("distance minimale parking : " + min**0.5);
	document.getElementById("parking").innerHTML = "Prix du parking le plus proche : " + tab[indice][21] + " €<br>";
	document.getElementById("parking").innerHTML += tab[indice][18] + '<br>'
	document.getElementById("parking").innerHTML += tab[indice][19] + '<br>'
}

function calculParkingInit(){
	var request = new XMLHttpRequest();
	request.open('GET', 'https://raw.githubusercontent.com/volcanomakingkit/ressources.tipe/main/bnls.csv');
	request.send();
	request.onload = function(){
		var valeursInitiales = request.response;
		valeursInitiales = valeursInitiales.split("\r\n");
		var len = valeursInitiales.length;
		console.log(valeursInitiales);
		var tab = [];
		for(var i = 0; i < len; i++){
			tab.push(valeursInitiales[i].split(";"));
		}
		console.log(tab);
		calculParking(tab);
		return tab;
	}
}

function calcul(){
	dist = document.getElementById("dist").value;
	lat = document.getElementById("lat").value;
	lon = document.getElementById("lon").value;
	console.log("calcul");
	var requestURL = 'https://api.cquest.org/dvf?lat='+lat+'&lon='+lon+'&dist='+dist;
	// console.log(requestURL);
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	var obj = ''; // tests pour appel console chrome
	var n_test;	  // aussi
	var len_test;
	
	request.onload = function() {
		document.getElementById("test").style.height = window.innerHeight;
		var data = request.response;
		var len = data.features.length;
		var dataText = ''
		var n = 0;
		var t = 0;
		var surface;
		for (var i = 0; i < len; i++){
			surface = data.features[i].properties.surface_relle_bati;
			prix = data.features[i].properties.valeur_fonciere
			if (!isNaN(surface) && !isNaN(prix)){
				n += prix / surface;
				t += 1
			}
			
			// dataText += data.features[i].properties.valeur_fonciere + ' € <br>';
		}
		dataText += 'Moyenne : ' + Math.ceil(n/t) + ' €/m²';
		dataText += '<br/>Nombres de valeurs : ' + t;
		dataText += '<br/>Prix : ' + document.getElementById("surface").value * Math.ceil(n/t) + " €";
		document.getElementById("test").innerHTML = dataText;
		obj = data;
		n_test = n;
		len_test = len;
		if (isNaN(n/len) && dist < 100){
			document.getElementById("dist").value ++;
			calcul();
		}
	}
}
