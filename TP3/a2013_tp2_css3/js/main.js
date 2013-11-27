/**
 * @author Jean-Michel
 */
var nbrObjsASelectionner;

$(document).ready(function() {
	$('nav a:contains("Jeu")').click(function() {
		if (localStorage.hasOwnProperty('backward') && localStorage.getItem('backward') != 'true') {
			$('nav a:contains("Jeu")').attr("href", localStorage.getItem('backward'));
			localStorage['backward'] = true;
		} else {
			return false;
		}
	});

	$('nav a:contains("Accueil")').click(function() {
		if (localStorage.hasOwnProperty('backward') && localStorage.getItem('backward') == 'true') {
			var url = window.location.href;
			if (localStorage.hasOwnProperty('rounds') && url.split('#').length < 2) {
				url += '#rounds';
			}
			localStorage['backward'] = url;
		}
	});

	$('nav a:contains("Règle du jeu")').click(function() {
		if (localStorage.hasOwnProperty('backward') && localStorage.getItem('backward') == 'true') {
			var url = window.location.href;
			if (localStorage.hasOwnProperty('rounds') && url.split('#').length < 2) {
				url += '#rounds';
			}
			localStorage['backward'] = url;
		}
	});

	$('.start').click(function() {
		localStorage.clear();
	});

	$('.restart').click(function() {
		restart('.restart');
	});
});

function restart(attr) {
	var result = confirm('Une partie est déjà en cours. Êtes-vous sûre de vouloir recommencer la partie?');
	if (result) {
		localStorage['pnt_endurance_player'] = localStorage.getItem('pnt_endurance_player_init');
		localStorage['pieces_or'] = localStorage.getItem('pieces_or_init');
		localStorage.removeItem('rounds');
		localStorage.removeItem('roundVal');
		localStorage.removeItem('pnt_endurance_enemy');
	} else {
		$(attr).attr("href", window.location.href);
	}
}

/**
 * Cette partie traite le cas ou le joueur doit se déposséder d'objets pour continuer l'aventure.
 */
$(document).ready(function() {
	var form = $('.itemsAJeter');
	if (form.length != 0) {
		$('#decision a').addClass('disabled');
		var legend = $('.itemsAJeter legend').text().trim();
		nbrObjsASelectionner = legend.match('[0-9]+');

		var objs = localStorage.getItem('armes');
		completeFormWithObj(objs);
		objs = localStorage.getItem('repas');
		completeFormWithObj(objs);
		objs = localStorage.getItem('objetsSac');
		completeFormWithObj(objs);
		objs = localStorage.getItem('objetsSpeciaux');
		completeFormWithObj(objs);
	} else {
		form = $('.itemsAAjouter');
		if (form.length != 0) {
			var legend = $('.itemsAAjouter legend').text().trim();
			nbrObjsASelectionner = legend.match('[0-9]+');
		}
	}
});

/**
 * Permet d'afficher les objets du joueur.
 */
function completeFormWithObj(objs) {
	if (objs == null || objs.length == 0) {
		return;
	}
	objs = objs.split(',');
	for (var i = 0; i < objs.length; i++) {
		$('.itemsAJeter fieldset').append('<input type=\"checkbox\" id=\"' + objs[i].replace(' ', '_') + '\" /><label for=\"' + objs[i].replace(' ', '_') + '\">' + objs[i] + '</label><br/>');
	}
}


$(document).ready(function() {
	/**
	 * Supprime les objets sélectionnés par le joueur lorsqu'il clic sur le bouton
	 */
	$('.itemsAJeter').submit(function(e) {
		var checkedObjs = $(".itemsAJeter input:checked").next();
		if (checkedObjs.length != nbrObjsASelectionner) {
			alert('Vous devez jeter uniquement ' + nbrObjsASelectionner + ' objet(s).');
			return false;
		}
		var objetsAJeter = new Array();
		var i = 0;
		checkedObjs.each(function() {
			objetsAJeter[i] = $(this).text();
			i++;
		});

		for ( i = 0; i < objetsAJeter.length; i++) {
			if (objetsAJeter[i].indexOf('(Arme)') != -1) {//l'objet sélectionné est une arme
				deleteObjFromLocalStorage(objetsAJeter[i], 'armes');
			} else if (objetsAJeter[i].indexOf('(Repas)') != -1) {//l'objet selectionné est un repas
				deleteObjFromLocalStorage(objetsAJeter[i], 'repas');
			} else if (objetsAJeter[i].indexOf('(Objet contenu dans le sac à dos)') != -1) {//l'objet sélectionné est contenu dans le sac à dos
				deleteObjFromLocalStorage(objetsAJeter[i], 'objetsSac');
			} else if (objetsAJeter[i].indexOf('(Objet spécial)') != -1) {//l'objet sélectionné est un objet spécial
				deleteObjFromLocalStorage(objetsAJeter[i], 'objetsSpeciaux');
			}
		}
		$('input[type="submit"]').hide();
		$('#decision a').removeClass('disabled').addClass('enabled');
		return false;
	});

	$('#decision a').click(function() {
		if ($('#decision a').attr('class') == 'disabled') {
			return false;
		}
		clearBattleStorage();
	});

	/**
	 * Ajoute les objets sélectionnés par le joueur lorsqu'il clic sur le bouton
	 */
	$('.itemsAAjouter').submit(function(e) {
		if (localStorage.getItem('nbreObj') == 8) {
			alert('Vous devez vous déposséder d\'au moins ' + nbrObjsASelectionner + ' objet(s) pour pouvoir en ajouter de nouveaux.\n (8 objets maximum dans le sac à dos)');
			return false;
		}
		var checkedObjs = $(".itemsAAjouter input:checked").next();
		if (checkedObjs.length > nbrObjsASelectionner) {
			alert('Vous devez ajouter uniquement ' + nbrObjsASelectionner + ' objet(s) ou moins.');
			return false;
		}
		var objetsAAjouter = new Array();
		var i = 0;
		checkedObjs.each(function() {
			objetsAAjouter[i] = $(this).text();
			i++;
		});

		for ( i = 0; i < objetsAAjouter.length; i++) {
			if (objetsAAjouter[i].indexOf('(Arme)') != -1) {
				var codeError = addObjFromLocalStorage(objetsAAjouter[i], 'armes');
				if (codeError == -1) {
					alert('Vous avez déjà 2 armes en votre possession.\n Veuillez en retirer une de votre sac à dos.');
					return false;
				}
				$('.sacArmes ul').append('<li>' + objetsAAjouter[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
			} else if (objetsAAjouter[i].indexOf('(Repas)') != -1) {
				addObjFromLocalStorage(objetsAAjouter[i], 'repas');
				$('.sacRepas ul').append('<li>' + objetsAAjouter[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
			} else if (objetsAAjouter[i].indexOf('(Objet contenu dans le sac à dos)') != -1) {
				addObjFromLocalStorage(objetsAAjouter[i], 'objetsSac');
				$('.sacObjSpe ul').append('<li>' + objetsAAjouter[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
			} else if (objetsAAjouter[i].indexOf('(Objet spécial)') != -1) {
				addObjFromLocalStorage(objetsAAjouter[i], 'objetsSpeciaux');
				$('.sacObj ul').append('<li>' + objetsAAjouter[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
			}
		}
		$('input[type="submit"]').hide();
		return false;
	});
});

/**
 * Supprime les objets sélectionnés du localStorage, et en même temps du sac à dos
 * @param {Object} obj
 * @param {Object} _localStorage
 */
function deleteObjFromLocalStorage(obj, _localStorage) {
	$(".itemsAJeter input:checked").next().remove();
	$(".itemsAJeter input:checked").remove();

	var result = localStorage.getItem(_localStorage);
	result = result.split(',');
	var temp = new Array(), j = 0;
	for (var i = 0; i < result.length; i++) {
		if (result[i] != obj) {
			temp[j] = result[i];
			j++;
		} else if (result[i].match('[(x]+[0-9]+[)]') != null && parseInt(result[i].match('[0-9]+')) > 1) {
			var value = result[i].match('[0-9]+');
			var newValue = parseInt(value) - 1;
			result[i] = result[i].replace(value, newValue);
			temp[j] = result[i];
			j++;
			$('#sac_a_dos li:contains(\"' + obj + '\")').html('<li>' + result[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
		} else {
			$('#sac_a_dos li:contains(\"' + obj + '\")').remove();
			localStorage['nbreObj'] = (localStorage.getItem('nbreObj') - 1);
		}
	}
	localStorage.removeItem(_localStorage);
	localStorage[_localStorage] = temp;
}

/**
 * Ajoute un objet dans le localStorage
 * @param {Object} obj
 * @param {Object} _localStorage
 */
function addObjFromLocalStorage(obj, _localStorage) {
	var result = localStorage.getItem(_localStorage);
	if (result.length == 0) {
		result = new Array();
	} else {
		result = result.split(',');
	}

	if (_localStorage == 'armes' && result.length == 2) {
		return -1;
	}
	result.push(obj);
	localStorage[_localStorage] = result;
	localStorage['nbreObj'] = parseInt(localStorage.getItem('nbreObj')) + 1;
}


$(document).ready(function() {

	disciplines = localStorage.getItem("disciplines");
	var check = -1;
	check = disciplines.search("Écran psychique");
	if (check == -1 && $('#decision').attr('class') == 'disciplineRequired') {
		$('#decision div p:first-child').css('display', 'none');
		return;
	}
	check = disciplines.search("Intuition");
	if (check == -1 && $('#decision').attr('class') == 'disciplineRequired') {
		$('#decision div p:first-child').css('display', 'none');
		return;
	}
});
