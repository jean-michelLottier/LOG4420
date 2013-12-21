var person = angular.module('person',[]);
var page = angular.module('page',[]);

person.controller('CharacteristicsCtrl', function($scope){
	$scope.endurance = localStorage.getItem("endurance")
	$scope.habilete = localStorage.getItem("habilete")
	$scope.piecesOr = localStorage.getItem("piecesOr")
});

function PageCtrl($scope, $http) {
	$scope.change = function(pageNumber) {
		if(pageNumber == 158){
			clearBattleStorage();
		}
		$http({method: 'GET', url: 'http://localhost:3000/service/' + pageNumber})
		.success(function(data) {
			$scope.pageNumber = data.pageNumber,
			$scope.page = data.page
			$scope.getContentElement = function(content, type){
				if(content.type == "Paragraph" && type == "Paragraph"){
					return content.paragraph;
				}else if(content.type == "Image" && type == "Image"){
					return content.name;
				}else if(content.type == "Battle" && type == "Battle"){
					return content;
				}else{
					return null;
				}
			}
			$scope.completeForm = function(){
				var form = $('#jeterObjets');
				if($("#jeterObjets fieldset input").length != 0){
					return;
				}
    			if (form.length != 0) {
        		$('#decision a').addClass('disabled');
        			var legend = $('#jeterObjets legend').text().trim();
        			nbrObjsASelectionner = legend.match('[0-9]+');

        			var objs = localStorage.getItem('sacADos');
        			completeFormWithObj(objs);
			    } else {
        			form = $('#ajouterObjets');
        			if (form.length != 0) {
            			var legend = $('#ajouterObjets legend').text().trim();
            			nbrObjsASelectionner = legend.match('[0-9]+');
        			}
    			}
			}
			$scope.initFight = function(content){
				if($("#fuir").attr("style") == "display: none;"){
					return;
				}

				$("#fuir").hide();
				$('#decision a').addClass('disabled');
				round = 0;
				initFightVariables(content);
			}
			$scope.initLoseLifePnt = function(){
				$('#decision a').addClass('disabled');
			}
			$scope.isMonster = function(content){
				if(!content.isMonster){
					$("img.monster").removeClass('monster');
				}else{
					$("img.monster").addClass('monster');
				}
			}
		})
		//.error(function(data) { $scope.paragraph = "erreur"; })
	}

	$scope.change(1);
}
