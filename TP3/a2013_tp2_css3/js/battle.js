/**
 * @author Jean-Michel
 */
var pnt_habilete_enemy = 0;
var pnt_endurance_enemy = 0;
var pnt_endurance_player = 0;
var pnt_habilete_player = 0;

var round = 0;
var table;
var battleRatio;

var sentence_round = "Ronde combat : ";
var sentence_ratio = "Ratio de combat : ";
var sentence_random_value = "Chiffre aléatoire : ";
var sentence_enemy_damage = "Ton enemi a eu ";
var sentence_enemy_endurance = " dégâts -<br/> et a maintenant ";
var sentence_enemy_endurance_bis = " points d'endurance.";
var sentence_player_damage = "Lone Wolf a eu ";
var sentence_player_endurance = " dégâts -<br/> et a maintenant ";
var sentence_player_endurance_bis = " points d'endurance.";

/*
 * Initialisation de l'environnement de combat.
 */
$(document).ready(function() {
	$(".button:contains('FUIR...')").hide();
	$('#decision a').addClass('disabled');

	pnt_habilete_enemy = $(".pnt_habilete_enemy").text();
	pnt_endurance_enemy = $(".pnt_endurance_enemy").text();
	pnt_endurance_player = localStorage.getItem("pnt_endurance_player");
	pnt_habilete_player = localStorage.getItem("pnt_habilete_player");

	table = createCombatTable(pnt_endurance_player, pnt_endurance_enemy);
	battleRatio = convertBattleRatio((pnt_habilete_player - pnt_habilete_enemy));

	var url = window.location.href;
	url = url.split('#');
	if (url.length >= 2 && url[1] == 'rounds') {//si un combat est en cours
		$("#combat").children().last().before(localStorage.getItem('rounds'));
		round = localStorage.getItem('roundVal');
		pnt_endurance_enemy = localStorage.getItem("pnt_endurance_enemy");
		if (round >= 2) {
			$(".button:contains('FUIR...')").show();
		}
	}

	localStorage['roundVal'] = round;
	localStorage['pnt_endurance_enemy'] = pnt_endurance_enemy;

	endBattle();
});

$(document).ready(function() {
	/**
	 * Lancement d'un round de combat
	 */
	$(".button:contains('CONTINUER...')").click(function() {
		round++;
		if (round == 2) {
			$(".button:contains('FUIR...')").show();
		}

		var randomValue = Math.floor((Math.random() * 9));
		var enemyDamage = table[randomValue][battleRatio][0];
		var playerDamage = table[randomValue][battleRatio][1];
		pnt_endurance_enemy -= enemyDamage;
		pnt_endurance_player -= playerDamage;

		if (pnt_endurance_enemy < 0) {
			pnt_endurance_enemy = 0;
		}
		if (pnt_endurance_player < 0) {
			pnt_endurance_player = 0;
		}
		localStorage['pnt_endurance_player'] = pnt_endurance_player;
		localStorage['pnt_endurance_enemy'] = pnt_endurance_enemy;
		localStorage['roundVal'] = round;

		var roundDescription = "<section>" + "<h3>" + sentence_round + round + "</h3>" + "<p>" + sentence_ratio + battleRatio + "<br/>" + sentence_random_value + randomValue + "</p>" + "<p>" + sentence_enemy_damage + enemyDamage + sentence_enemy_endurance + pnt_endurance_enemy + sentence_enemy_endurance_bis + "</p>" + "<p>" + sentence_player_damage + playerDamage + sentence_player_endurance + pnt_endurance_player + sentence_player_endurance_bis + "</p>" + "</section>";
		$('#pnt_endurance .right').text(localStorage.getItem('pnt_endurance_player') + '/29');
		$("#combat").children().last().before(roundDescription);

		if (localStorage.hasOwnProperty('rounds')) {
			localStorage['rounds'] += roundDescription;
		} else {
			localStorage['rounds'] = roundDescription;
		}
		endBattle();
	});
});

$(document).ready(function() {
	$('#decision a').click(function() {
		if ($('#decision a').attr('class') == 'disabled') {
			return false;
		}
		clearBattleStorage();
	});

	$('#player_defeat a:last-child').click(function() {
		var Backlen = history.length;
		if (Backlen > 0) {
			history.go(-Backlen);
		}
		//TODO : Supprimer l'historique pour éviter que le joueur triche'
		localStorage.clear();
	});

	$(".button:contains('FUIR...')").click(function() {
		clearBattleStorage();
		window.location = "../html/page158.html";
	});

});

function convertBattleRatio(battleRatio) {
	if (battleRatio <= -11) {
		return 0;
	} else if (battleRatio >= 11) {
		return 22;
	} else {
		return battleRatio + 11;
	}
}

/**
 * Cette fonction permet d'aiguiller le message de fin de combat en fonction du vainqueur.
 */
function endBattle() {
	if (pnt_endurance_player == 0) {
		window.location.replace(window.location.pathname + '#player_defeat');
		$(".button:contains('FUIR...')").hide();
		$(".button:contains('CONTINUER...')").hide();
	} else if (pnt_endurance_enemy == 0) {
		$('#decision a').removeClass('disabled').addClass('enabled');
		alert("FIN du combat. Vous êtes victorieux!");
		$(".button:contains('FUIR...')").hide();
		$(".button:contains('CONTINUER...')").hide();
	}
}

function clearBattleStorage() {
	localStorage.removeItem('rounds');
	localStorage.removeItem('roundVal');
	localStorage.removeItem('pnt_endurance_enemy');
}

function createCombatTable(enduranceTotalJoueur, enduranceTotalMonstre) {
	var table = createArray(10, 23, 2);
	//[random value][combat ratio][0:enemy, 1:Lone Wolf]
	table[0][0][0] = 6;
	table[0][0][1] = 0;
	table[0][1][0] = 7;
	table[0][1][1] = 0;
	table[0][2][0] = 7;
	table[0][2][1] = 0;
	table[0][3][0] = 8;
	table[0][3][1] = 0;
	table[0][4][0] = 8;
	table[0][4][1] = 0;
	table[0][5][0] = 9;
	table[0][5][1] = 0;
	table[0][6][0] = 9;
	table[0][6][1] = 0;
	table[0][7][0] = 10;
	table[0][7][1] = 0;
	table[0][8][0] = 10;
	table[0][8][1] = 0;
	table[0][9][0] = 11;
	table[0][9][1] = 0;
	table[0][10][0] = 11;
	table[0][10][1] = 0;
	table[0][11][0] = 12;
	table[0][11][1] = 0;
	table[0][12][0] = 14;
	table[0][12][1] = 0;
	table[0][13][0] = 14;
	table[0][13][1] = 0;
	table[0][14][0] = 16;
	table[0][14][1] = 0;
	table[0][15][0] = 16;
	table[0][15][1] = 0;
	table[0][16][0] = 18;
	table[0][16][1] = 0;
	table[0][17][0] = 18;
	table[0][17][1] = 0;
	table[0][18][0] = enduranceTotalMonstre;
	table[0][18][1] = 0;
	table[0][19][0] = enduranceTotalMonstre;
	table[0][19][1] = 0;
	table[0][20][0] = enduranceTotalMonstre;
	table[0][20][1] = 0;
	table[0][21][0] = enduranceTotalMonstre;
	table[0][21][1] = 0;
	table[0][22][0] = enduranceTotalMonstre;
	table[0][22][1] = 0;

	table[1][0][0] = 0;
	table[1][0][1] = enduranceTotalJoueur;
	table[1][1][0] = 0;
	table[1][1][1] = enduranceTotalJoueur;
	table[1][2][0] = 0;
	table[1][2][1] = enduranceTotalJoueur;
	table[1][3][0] = 0;
	table[1][3][1] = 8;
	table[1][4][0] = 0;
	table[1][4][1] = 8;
	table[1][5][0] = 0;
	table[1][5][1] = 6;
	table[1][6][0] = 0;
	table[1][6][1] = 6;
	table[1][7][0] = 1;
	table[1][7][1] = 6;
	table[1][8][0] = 1;
	table[1][8][1] = 6;
	table[1][9][0] = 2;
	table[1][9][1] = 5;
	table[1][10][0] = 2;
	table[1][10][1] = 5;
	table[1][11][0] = 3;
	table[1][11][1] = 5;
	table[1][12][0] = 4;
	table[1][12][1] = 5;
	table[1][13][0] = 4;
	table[1][13][1] = 5;
	table[1][14][0] = 5;
	table[1][14][1] = 4;
	table[1][15][0] = 5;
	table[1][15][1] = 4;
	table[1][16][0] = 6;
	table[1][16][1] = 4;
	table[1][17][0] = 6;
	table[1][17][1] = 4;
	table[1][18][0] = 7;
	table[1][18][1] = 4;
	table[1][19][0] = 7;
	table[1][19][1] = 4;
	table[1][20][0] = 8;
	table[1][20][1] = 3;
	table[1][21][0] = 8;
	table[1][21][1] = 3;
	table[1][22][0] = 9;
	table[1][22][1] = 3;

	table[2][0][0] = 0;
	table[2][0][1] = enduranceTotalJoueur;
	table[2][1][0] = 0;
	table[2][1][1] = 8;
	table[2][2][0] = 0;
	table[2][2][1] = 8;
	table[2][3][0] = 0;
	table[2][3][1] = 7;
	table[2][4][0] = 0;
	table[2][4][1] = 7;
	table[2][5][0] = 1;
	table[2][5][1] = 6;
	table[2][6][0] = 1;
	table[2][6][1] = 6;
	table[2][7][0] = 2;
	table[2][7][1] = 5;
	table[2][8][0] = 2;
	table[2][8][1] = 5;
	table[2][9][0] = 3;
	table[2][9][1] = 5;
	table[2][10][0] = 3;
	table[2][10][1] = 5;
	table[2][11][0] = 4;
	table[2][11][1] = 4;
	table[2][12][0] = 5;
	table[2][12][1] = 4;
	table[2][13][0] = 5;
	table[2][13][1] = 4;
	table[2][14][0] = 6;
	table[2][14][1] = 3;
	table[2][15][0] = 6;
	table[2][15][1] = 3;
	table[2][16][0] = 7;
	table[2][16][1] = 3;
	table[2][17][0] = 7;
	table[2][17][1] = 3;
	table[2][18][0] = 8;
	table[2][18][1] = 3;
	table[2][19][0] = 8;
	table[2][19][1] = 3;
	table[2][20][0] = 9;
	table[2][20][1] = 3;
	table[2][21][0] = 9;
	table[2][21][1] = 3;
	table[2][22][0] = 10;
	table[2][22][1] = 2;

	table[3][0][0] = 0;
	table[3][0][1] = 8;
	table[3][1][0] = 0;
	table[3][1][1] = 7;
	table[3][2][0] = 0;
	table[3][2][1] = 7;
	table[3][3][0] = 1;
	table[3][3][1] = 6;
	table[3][4][0] = 1;
	table[3][4][1] = 6;
	table[3][5][0] = 2;
	table[3][5][1] = 5;
	table[3][6][0] = 2;
	table[3][6][1] = 5;
	table[3][7][0] = 3;
	table[3][7][1] = 5;
	table[3][8][0] = 3;
	table[3][8][1] = 5;
	table[3][9][0] = 4;
	table[3][9][1] = 4;
	table[3][10][0] = 4;
	table[3][10][1] = 4;
	table[3][11][0] = 5;
	table[3][11][1] = 4;
	table[3][12][0] = 6;
	table[3][12][1] = 3;
	table[3][13][0] = 6;
	table[3][13][1] = 3;
	table[3][14][0] = 7;
	table[3][14][1] = 3;
	table[3][15][0] = 7;
	table[3][15][1] = 3;
	table[3][16][0] = 8;
	table[3][16][1] = 3;
	table[3][17][0] = 8;
	table[3][17][1] = 3;
	table[3][18][0] = 9;
	table[3][18][1] = 2;
	table[3][19][0] = 9;
	table[3][19][1] = 2;
	table[3][20][0] = 10;
	table[3][20][1] = 2;
	table[3][21][0] = 10;
	table[3][21][1] = 2;
	table[3][22][0] = 11;
	table[3][22][1] = 2;

	table[4][0][0] = 0;
	table[4][0][1] = 8;
	table[4][1][0] = 1;
	table[4][1][1] = 7;
	table[4][2][0] = 1;
	table[4][2][1] = 7;
	table[4][3][0] = 2;
	table[4][3][1] = 6;
	table[4][4][0] = 2;
	table[4][4][1] = 6;
	table[4][5][0] = 3;
	table[4][5][1] = 5;
	table[4][6][0] = 3;
	table[4][6][1] = 5;
	table[4][7][0] = 4;
	table[4][7][1] = 4;
	table[4][8][0] = 4;
	table[4][8][1] = 4;
	table[4][9][0] = 5;
	table[4][9][1] = 4;
	table[4][10][0] = 5;
	table[4][10][1] = 4;
	table[4][11][0] = 6;
	table[4][11][1] = 3;
	table[4][12][0] = 7;
	table[4][12][1] = 3;
	table[4][13][0] = 7;
	table[4][13][1] = 3;
	table[4][14][0] = 8;
	table[4][14][1] = 2;
	table[4][15][0] = 8;
	table[4][15][1] = 2;
	table[4][16][0] = 9;
	table[4][16][1] = 2;
	table[4][17][0] = 9;
	table[4][17][1] = 2;
	table[4][18][0] = 10;
	table[4][18][1] = 2;
	table[4][19][0] = 10;
	table[4][19][1] = 2;
	table[4][20][0] = 11;
	table[4][20][1] = 2;
	table[4][21][0] = 11;
	table[4][21][1] = 2;
	table[4][22][0] = 12;
	table[4][22][1] = 2;

	table[5][0][0] = 1;
	table[5][0][1] = 7;
	table[5][1][0] = 2;
	table[5][1][1] = 6;
	table[5][2][0] = 2;
	table[5][2][1] = 6;
	table[5][3][0] = 3;
	table[5][3][1] = 5;
	table[5][4][0] = 3;
	table[5][4][1] = 5;
	table[5][5][0] = 4;
	table[5][5][1] = 4;
	table[5][6][0] = 4;
	table[5][6][1] = 4;
	table[5][7][0] = 5;
	table[5][7][1] = 4;
	table[5][8][0] = 5;
	table[5][8][1] = 4;
	table[5][9][0] = 6;
	table[5][9][1] = 3;
	table[5][10][0] = 6;
	table[5][10][1] = 3;
	table[5][11][0] = 7;
	table[5][11][1] = 2;
	table[5][12][0] = 8;
	table[5][12][1] = 2;
	table[5][13][0] = 8;
	table[5][13][1] = 2;
	table[5][14][0] = 9;
	table[5][14][1] = 2;
	table[5][15][0] = 9;
	table[5][15][1] = 2;
	table[5][16][0] = 10;
	table[5][16][1] = 2;
	table[5][17][0] = 10;
	table[5][17][1] = 2;
	table[5][18][0] = 11;
	table[5][18][1] = 2;
	table[5][19][0] = 11;
	table[5][19][1] = 2;
	table[5][20][0] = 12;
	table[5][20][1] = 2;
	table[5][21][0] = 12;
	table[5][21][1] = 2;
	table[5][22][0] = 14;
	table[5][22][1] = 1;

	table[6][0][0] = 2;
	table[6][0][1] = 6;
	table[6][1][0] = 3;
	table[6][1][1] = 6;
	table[6][2][0] = 3;
	table[6][2][1] = 6;
	table[6][3][0] = 4;
	table[6][3][1] = 5;
	table[6][4][0] = 4;
	table[6][4][1] = 5;
	table[6][5][0] = 5;
	table[6][5][1] = 4;
	table[6][6][0] = 5;
	table[6][6][1] = 4;
	table[6][7][0] = 6;
	table[6][7][1] = 3;
	table[6][8][0] = 6;
	table[6][8][1] = 3;
	table[6][9][0] = 7;
	table[6][9][1] = 2;
	table[6][10][0] = 7;
	table[6][10][1] = 2;
	table[6][11][0] = 8;
	table[6][11][1] = 2;
	table[6][12][0] = 9;
	table[6][12][1] = 2;
	table[6][13][0] = 9;
	table[6][13][1] = 2;
	table[6][14][0] = 10;
	table[6][14][1] = 2;
	table[6][15][0] = 10;
	table[6][15][1] = 2;
	table[6][16][0] = 11;
	table[6][16][1] = 1;
	table[6][17][0] = 11;
	table[6][17][1] = 1;
	table[6][18][0] = 12;
	table[6][18][1] = 1;
	table[6][19][0] = 12;
	table[6][19][1] = 1;
	table[6][20][0] = 14;
	table[6][20][1] = 1;
	table[6][21][0] = 14;
	table[6][21][1] = 1;
	table[6][22][0] = 16;
	table[6][22][1] = 1;

	table[7][0][0] = 3;
	table[7][0][1] = 5;
	table[7][1][0] = 4;
	table[7][1][1] = 5;
	table[7][2][0] = 4;
	table[7][2][1] = 5;
	table[7][3][0] = 5;
	table[7][3][1] = 4;
	table[7][4][0] = 5;
	table[7][4][1] = 4;
	table[7][5][0] = 6;
	table[7][5][1] = 3;
	table[7][6][0] = 6;
	table[7][6][1] = 3;
	table[7][7][0] = 7;
	table[7][7][1] = 2;
	table[7][8][0] = 7;
	table[7][8][1] = 2;
	table[7][9][0] = 8;
	table[7][9][1] = 2;
	table[7][10][0] = 8;
	table[7][10][1] = 2;
	table[7][11][0] = 9;
	table[7][11][1] = 1;
	table[7][12][0] = 10;
	table[7][12][1] = 1;
	table[7][13][0] = 10;
	table[7][13][1] = 1;
	table[7][14][0] = 11;
	table[7][14][1] = 1;
	table[7][15][0] = 11;
	table[7][15][1] = 1;
	table[7][16][0] = 12;
	table[7][16][1] = 0;
	table[7][17][0] = 12;
	table[7][17][1] = 0;
	table[7][18][0] = 14;
	table[7][18][1] = 0;
	table[7][19][0] = 14;
	table[7][19][1] = 0;
	table[7][20][0] = 16;
	table[7][20][1] = 0;
	table[7][21][0] = 16;
	table[7][21][1] = 0;
	table[7][22][0] = 18;
	table[7][22][1] = 0;

	table[8][0][0] = 4;
	table[8][0][1] = 4;
	table[8][1][0] = 5;
	table[8][1][1] = 4;
	table[8][2][0] = 5;
	table[8][2][1] = 4;
	table[8][3][0] = 6;
	table[8][3][1] = 3;
	table[8][4][0] = 6;
	table[8][4][1] = 3;
	table[8][5][0] = 7;
	table[8][5][1] = 2;
	table[8][6][0] = 7;
	table[8][6][1] = 2;
	table[8][7][0] = 8;
	table[8][7][1] = 1;
	table[8][8][0] = 8;
	table[8][8][1] = 1;
	table[8][9][0] = 9;
	table[8][9][1] = 1;
	table[8][10][0] = 9;
	table[8][10][1] = 1;
	table[8][11][0] = 10;
	table[8][11][1] = 0;
	table[8][12][0] = 11;
	table[8][12][1] = 0;
	table[8][13][0] = 11;
	table[8][13][1] = 0;
	table[8][14][0] = 12;
	table[8][14][1] = 0;
	table[8][15][0] = 12;
	table[8][15][1] = 0;
	table[8][16][0] = 14;
	table[8][16][1] = 0;
	table[8][17][0] = 14;
	table[8][17][1] = 0;
	table[8][18][0] = 16;
	table[8][18][1] = 0;
	table[8][19][0] = 16;
	table[8][19][1] = 0;
	table[8][20][0] = 18;
	table[8][20][1] = 0;
	table[8][21][0] = 18;
	table[8][21][1] = 0;
	table[8][22][0] = enduranceTotalMonstre;
	table[8][22][1] = 0;

	table[9][0][0] = 5;
	table[9][0][1] = 3;
	table[9][1][0] = 6;
	table[9][1][1] = 3;
	table[9][2][0] = 6;
	table[9][2][1] = 3;
	table[9][3][0] = 7;
	table[9][3][1] = 2;
	table[9][4][0] = 7;
	table[9][4][1] = 2;
	table[9][5][0] = 8;
	table[9][5][1] = 0;
	table[9][6][0] = 8;
	table[9][6][1] = 0;
	table[9][7][0] = 9;
	table[9][7][1] = 0;
	table[9][8][0] = 9;
	table[9][8][1] = 0;
	table[9][9][0] = 10;
	table[9][9][1] = 0;
	table[9][10][0] = 10;
	table[9][10][1] = 0;
	table[9][11][0] = 11;
	table[9][11][1] = 0;
	table[9][12][0] = 12;
	table[9][12][1] = 0;
	table[9][13][0] = 12;
	table[9][13][1] = 0;
	table[9][14][0] = 14;
	table[9][14][1] = 0;
	table[9][15][0] = 14;
	table[9][15][1] = 0;
	table[9][16][0] = 16;
	table[9][16][1] = 0;
	table[9][17][0] = 16;
	table[9][17][1] = 0;
	table[9][18][0] = 18;
	table[9][18][1] = 0;
	table[9][19][0] = 18;
	table[9][19][1] = 0;
	table[9][20][0] = enduranceTotalMonstre;
	table[9][20][1] = 0;
	table[9][21][0] = enduranceTotalMonstre;
	table[9][21][1] = 0;
	table[9][22][0] = enduranceTotalMonstre;
	table[9][22][1] = 0;

	return table;
}

function createArray(length) {
	var arr = new Array(length || 0), i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while (i--)
		arr[length - 1 - i] = createArray.apply(this, args);
	}

	return arr;
}

