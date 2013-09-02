

function StatsCtrl($scope, $http) {

	$scope.parkings = [ 
				{name: "PMED"}, 
				{name: "ARENAS"}, 
				{name: "VALOMBROSE"}, 
				{name: "MAGNAN"}, 
				{name: "MARSHALL"}, 
				{name: "ARTS"}, 
				{name: "CORVESY"}, 
				{name: "PALMERA"}, 
				{name: "MASSENA"}, 
				{name: "BOSQUET"} 
				];
				
	
	$scope.stats = [ 
			{name: "Actions cdp", action: "cdp"},
			{name: "Non lues cdp(%)", action: "unread"},
			{name: "Non lues cdp(total)", action: "unreadtotal"},
			{name: "Remplissage Db", action: "totaldb"},
			{name: "Mouvements", action: "totalmov"},
			{name: "Lecture parfaite", action:"perfect"},
			{name: "Avec 1.err", action:"error_1"},
			{name: "Avec 2.err", action:"error_2"}
			];
			
			
	$scope.changePlotType = function() {
		
		//console.log($scope.statSelected.action);
		plotData($scope.parkingSelected.name, $scope.statSelected.action);
	}
	
	$scope.changeParking = function() {
		
		//console.log($scope.parkingSelected.name);
		$scope.noParkSelected = false;
	}
	
	plotData = function(parkname, type) {
		$http.get('/stats/' + type + '/' + parkname).success(function(plotdata) {
			console.log(plotdata);
			
			var p = [
					{ data: plotdata, label: parkname }
				];
				
				// prepare options
				var options = {
				canvas: false,
				xaxes: [ { mode: "time" } ]
				}
				
				// plot the data using flot
				$.plot("#placeholder", p,options);
				
		});
	}
}