'use strict';

var app = angular.module('dv-sptm', ['ngMaterial']);

app.controller('mainCtrl', ['$scope', '$mdDialog', '$timeout', function($scope, $mdDialog, $timeout) {
	$scope.data = {
		tree: {
			root: [],
			json: '',
			config: {
				marginLeftPX: 5,
				prettify: true
			},
			NODE_TEMPLATE: {
				desc: '',
				is_enabled: true,
				is_container_type: false,
				offset: '',
				value: ''
				// children: []
			}
		}
	};

	$scope.dialogControllers = {
		loadJSON: ['$scope', '$mdDialog', function($scope, $mdDialog) {
			$scope.data = {};

			$scope.load = function() {
				$mdDialog.hide($scope.data.json);
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}]
	};

	$scope.data.tree.assignParents = function(currentNode, parentNode) {
		if (!currentNode) {
			currentNode = $scope.data.tree.root;
			parentNode = null;
		}

		angular.forEach(currentNode, function(childNode) {
			var parents = [];
			
			if (parentNode) {
				angular.copy(parentNode.$$parents, parents);
				parents.push(parentNode.$$hashKey);
			}
			
			childNode.$$parents = parents;

			if (childNode.children) {
				$scope.data.tree.assignParents(childNode.children, childNode);
			}
		});
	};

	$scope.data.tree.updateJson = function() {
		var isPrettify = $scope.data.tree.config.prettify;

		$scope.data.tree.json = angular.toJson($scope.data.tree.root, isPrettify);
	};

	$scope.data.tree.deleteNode = function(parentsArr, currentNode, targetNodeId) {
		if (currentNode && currentNode.length > 0) {
			if (parentsArr.length === 0) {
				angular.forEach(currentNode, function(node, index) {
					if (node.$$hashKey === targetNodeId) {
						currentNode.splice(index, 1);
					}
				});
			} else {
				var searchParent = parentsArr.shift();
				angular.forEach(currentNode, function(node) {
					if (node.$$hashKey === searchParent) {
						$scope.data.tree.deleteNode(parentsArr, node.children, targetNodeId);
					}
				});
			}
		}
	};

	$scope.loadJSON = function(ev) {
		$mdDialog.show({
			controller: $scope.dialogControllers.loadJSON,
			templateUrl: './templates/loadJSONDialog.html',
			targetEvent: ev
		}).then(function(result) {
			$scope.data.tree.root = angular.fromJson(result);
			$scope.data.tree.updateJson();
			$timeout(function() {
				$scope.data.tree.assignParents();
				// console.log($scope.data.tree.root);
			}, 500);
		});
	};

	$scope.togglePrettify = function() {
		$scope.data.tree.config.prettify = !$scope.data.tree.config.prettify;
		$scope.data.tree.updateJson();
	};
}])

.controller('treeContainerCtrl', ['$scope', function($scope) {
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
}])

.controller('treeEntryCtrl', ['$scope', function($scope) {
	$scope.UI = {};
	var updateSwitchCaption = function() {
			if ($scope.treeNode.is_container_type) {
				if (angular.isString($scope.treeNode.offset)) {
					$scope.treeNode.offset = undefined;
					$scope.treeNode.value = undefined;
				}

				$scope.treeNode.children = $scope.treeNode.children || [];

				$scope.UI.container_type_caption = "Container"
			} else {
				if ($scope.treeNode.children) {
					$scope.treeNode.children = undefined;
				}

				$scope.treeNode.offset = $scope.treeNode.offset || '';
				$scope.treeNode.value = $scope.treeNode.value || '';

				$scope.UI.container_type_caption = "Offset"
			}
		},
		updateEntryCaption = function() {
			if (angular.isDefined($scope.treeNode.is_enabled)) {
				$scope.treeNode.is_enabled = $scope.treeNode.is_enabled;	
			} else {
				$scope.treeNode.is_enabled = true;	
			}

			if ($scope.treeNode.is_enabled) {
				$scope.UI.enabled_caption = 'Enabled';
			} else {
				$scope.UI.enabled_caption = 'Disabled';
			}
			
		};

	// console.debug($scope.treeNode);
	updateEntryCaption();
	updateSwitchCaption();

	$scope.removeNode = function() {
		$scope.treeData.deleteNode($scope.treeNode.$$parents, $scope.treeData.root, $scope.treeNode.$$hashKey);
		$scope.treeData.updateJson();
	};

	$scope.toggleContainerType = function() {
		updateSwitchCaption();
		$scope.treeData.updateJson();
	};

	$scope.toggleEntry = function() {
		updateEntryCaption();
		$scope.treeData.updateJson();	
	};
}])

.directive('treeContainer', [function() {
	return {
		restrict: 'E',
		controller: 'treeContainerCtrl',
		scope: {
			treeData: '=',
			parentNode: '=',
			treeNode: '='
		},
		templateUrl: './templates/treeContainer.html'
	};
}])

.directive('treeEntry', ['$compile', '$http', '$sce', function($compile, $http, $sce) {
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
					var templateUrl = $sce.getTrustedResourceUrl('./templates/treeEntry.html');
					$http
						.get(templateUrl)
						.then(function(result) {
							var htmlTemplate = angular.element($sce.getTrustedHtml($sce.trustAsHtml(result.data)));
							instanceElement.append($compile(htmlTemplate)(scope));
						});
				}
			};
		}
	};
}]);
