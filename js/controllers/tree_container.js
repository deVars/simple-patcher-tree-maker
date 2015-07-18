'use strict';

app.controller('treeContainerCtrl', ['$scope', function($scope) {
	$scope.addNode = function () {
		var tempNode = {},
			parents = [];

		// console.log('Add node was pressed');
		angular.copy($scope.treeData.NODE_TEMPLATE, tempNode);
		
		if ($scope.parentNode && $scope.parentNode.$$parents) {
			angular.copy($scope.parentNode.$$parents, parents);
			parents.push($scope.parentNode.$$hashKey);
		}

		tempNode.$$parents = parents;
		$scope.treeNode.push(tempNode);
		//console.log($scope.treeData.root);
		$scope.treeData.updateJson();
	}
}]);
