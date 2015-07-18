'use strict';

app.directive('treeEntry', ['$compile', '$http', '$sce', function($compile, $http, $sce) {
	var templateUrl = $sce.getTrustedResourceUrl('./views/templates/tree_entry.html');
	var htmlTreeTemplate = null;

	if (htmlTreeTemplate == null) {
		$http
			.get(templateUrl)
			.then(function(result) {
				htmlTreeTemplate = $sce.getTrustedHtml($sce.trustAsHtml(result.data));
			});	
	}

	return {
		restrict: 'E',
		controller: 'treeEntryCtrl',
		scope: {
			treeData: '=',
			treeNode: '='
		},
		compile: function(templateElement, templateAttributes) {
			return {
				pre: function(scope, instanceElement, instanceAttributes, controller) {},
				post: function(scope, instanceElement, instanceAttributes, controller) {
					var anElement = angular.element(htmlTreeTemplate);

					instanceElement.append($compile(anElement)(scope));
				}
			};
		}
	};
}]);
