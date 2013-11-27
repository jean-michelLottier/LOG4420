/**
 * @author Jean-Michel
 */
$(document).ready(function() {
	$('#pnt_endurance .right').text(localStorage.getItem('pnt_endurance_player') + '/29');
	$('#pnt_attaque .right').text(localStorage.getItem('pnt_habilete_player') + '/19');
	$('#pnt_gold .right').text(localStorage.getItem('pieces_or') + '/50');
	var disciplines = localStorage.getItem('disciplines');
	disciplines = disciplines.split(',');
	$('#disciplines li:first-child').text(disciplines[0]);
	$('#disciplines .second').text(disciplines[1]);
	$('#disciplines li:last-child').text(disciplines[2]);

	var armes = localStorage.getItem('armes');
	if (armes != null && armes.length > 0) {
		armes = armes.split(',');
		for (var i = 0; i < armes.length; i++) {
			$('.sacArmes ul').append('<li>' + armes[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
		}
	}
	var repas = localStorage.getItem('repas');
	if (repas != null && repas.length > 0) {
		repas = repas.split(',');
		for ( i = 0; i < repas.length; i++) {
			$('.sacRepas ul').append('<li>' + repas[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
		}
	}
	var objetsSpeciaux = localStorage.getItem('objetsSpeciaux');
	if (objetsSpeciaux != null && objetsSpeciaux.length > 0) {
		objetsSpeciaux = objetsSpeciaux.split(',');
		for ( i = 0; i < objetsSpeciaux.length; i++) {
			$('.sacObjSpe ul').append('<li>' + objetsSpeciaux[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
		}
	}
	var objetsSac = localStorage.getItem('objetsSac');
	if (objetsSac != null && objetsSac.length > 0) {
		objetsSac = objetsSac.split(',');
		for ( i = 0; i < objetsSac.length; i++) {
			$('.sacObj ul').append('<li>' + objetsSac[i] + ' <span onclick="deleteObj($(this).parent())">&times;</span></li>');
		}
	}
});

function openBag(arg1) {
	jQuery(arg1).toggle("slow");
}

/**
 * Supprime un objet du sac à dos
 * @param {Object} obj
 */
function deleteObj(obj) {
	var objName = $(obj).text();
	objName = objName.replace('×', '').trim();
	//$(obj).remove();
	if (objName.indexOf('(Arme)') != -1) {
		deleteObjFromLocalStorage(objName, 'armes');
	} else if (objName.indexOf('(Repas)') != -1) {
		deleteObjFromLocalStorage(objName, 'repas');
	} else if (objName.indexOf('(Objet spécial)') != -1) {
		deleteObjFromLocalStorage(objName, 'objetsSpeciaux');
	} else if (objName.indexOf('(Objet contenu dans le sac à dos)') != -1) {
		deleteObjFromLocalStorage(objName, 'objetsSac');
	}
}
