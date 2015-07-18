'use strict';

app.controller('treeEntryCtrl', ['$mdDialog', '$scope', function($mdDialog, $scope) {
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
			
		},
		editEntry = ['$scope', '$mdDialog', function($scope, $mdDialog) {
			$scope.data = {
				desc: '',
				offset: '',
				value: ''
			};

			$scope.load = function() {
				$mdDialog.hide($scope.data);
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}];

	// console.debug($scope.treeNode);
	updateEntryCaption();
	updateSwitchCaption();

	$scope.showEditDialog = function(ev) {
		$mdDialog.show({
			controller: editEntry,
			templateUrl: './views/dialogs/edit_entry.html',
			targetEvent: ev
		}).then(function(result) {
			$scope.treeNode.desc = result.desc;
			$scope.treeNode.offset = result.offset;
			$scope.treeNode.value = result.value;
		});
	};

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
}]);
