/**
 * Variables globales
 */

/*
 * Fonction qui génère des valeurs aléatoires pour les points d'habileté,
 * les points d'endurance et les pièces d'or du joueur.
 */
$(document).ready(function() {
	//Valeurs aléatoires des statistiques du joueur
	var pnt_habilete = Math.floor((Math.random() * 10) + 10);
	var pnt_endurance = Math.floor((Math.random() * 10) + 20);
	var pieces_or = Math.floor((Math.random() * 10) + 10);

	$("#pnt_habilete").text(pnt_habilete);
	$("#pnt_endurance").text(pnt_endurance);
	$("#pieces_or").text(pieces_or);

	localStorage["pnt_habilete_player"] = pnt_habilete;
	localStorage["pnt_endurance_player"] = pnt_endurance;
	localStorage["pnt_endurance_player_init"] = pnt_endurance;
	localStorage["pieces_or"] = pieces_or;
	localStorage["pieces_or_init"] = pieces_or;
	localStorage["backward"] = true;
});

/*
 * Fonction qui valide que l'utilisateur a choisi le bon nombre de disciplines
 * et le bon nombre d'objets
 */
$(document).ready(function() {
	$('form').submit(function(e) {
		e.preventDefault();
		//Empêche le form de submitter

		var checkedDisciplines = $("fieldset#disciplines input:checked").next();
		var checkedObjects = $("fieldset#objets input:checked").next();

		var disciplineError = "Vous devez choisir EXACTEMENT 3 disciplines";
		var objectsError = "Vous devez choisir EXACTEMENT 5 objets.";

		if (checkedDisciplines.length != 3 && checkedObjects.length != 5) {
			alert('ERREUR(S):\n\n' + disciplineError + '\n' + objectsError);
		} else if (checkedDisciplines.length != 3) {
			alert('ERREUR(S):\n\n' + disciplineError);
		} else if (checkedObjects.length != 5) {
			alert('ERREUR(S):\n\n' + objectsError);
		} else if ($(".armes:checked").length > 2) {
			alert('ERREUR :\n\n Vous devez choisir uniquement 2 armes.');
		} else {
			var disciplines = new Array();
			var i = 0;
			checkedDisciplines.each(function() {
				disciplines[i] = $(this).text();
				i++;
			});
			localStorage["disciplines"] = disciplines;

			var objets = new Array();
			i = 0;
			checkedObjects.each(function() {
				objets[i] = $(this).text();
				i++;
			});

			var armes = new Array(), objetsSpe = new Array(), objetsSac = new Array(), repas = new Array();
			var j = 0, k = 0, l = 0, m = 0;
			for ( i = 0; i < objets.length; i++) {
				if (objets[i].indexOf('(Repas)') != -1) {
					repas[j] = objets[i];
					j++;
				} else if (objets[i].indexOf('(Arme)') != -1) {
					armes[k] = objets[i];
					k++;
				} else if (objets[i].indexOf('(Objet spécial)') != -1) {
					objetsSpe[l] = objets[i];
					l++;
				} else if (objets[i].indexOf('(Objet contenu dans le sac à dos)') != -1) {
					objetsSac[m] = objets[i];
					m++;
				}
			}
			localStorage["armes"] = armes;
			localStorage["objetsSpeciaux"] = objetsSpe;
			localStorage["objetsSac"] = objetsSac;
			localStorage["repas"] = repas;
			localStorage["nbreObj"] = 5;

			window.location = "../html/page1.html";
		}
	});
});

