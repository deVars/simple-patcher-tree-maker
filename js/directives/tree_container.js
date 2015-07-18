'use strict';

app.directive('treeContainer', [function() {
	return {
		restrict: 'E',
		controller: 'treeContainerCtrl',
		scope: {
			treeData: '=',
			parentNode: '=',
			treeNode: '='
		},
		templateUrl: './views/templates/tree_container.html'
	};
}]);
