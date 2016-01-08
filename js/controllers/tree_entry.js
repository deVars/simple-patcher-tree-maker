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
    propagateEnable = function (node, isEnable) {
      node.is_enabled = isEnable;
      node.$$is_hidden_by_parent = !isEnable;
      if (node.children && node.children.length > 0) {
        for (var i = 0, len = node.children.length; i < len; i++) {
          propagateEnable(node.children[i], isEnable);
        }
      }
    },
    updateEntryCaption = function() {
      var treeNode = $scope.treeNode;
      if (angular.isDefined(treeNode.is_enabled)) {
        treeNode.is_enabled = treeNode.is_enabled;
      } else {
        treeNode.is_enabled = true;
      }
      if (treeNode.is_enabled) {
        $scope.UI.enabled_caption = 'Enabled';
      } else {
        $scope.UI.enabled_caption = 'Disabled';
      }
    },
    editEntry = ['$scope', '$mdDialog', 'originalValues', function($scope, $mdDialog, originalValues) {
      $scope.data = {
        desc: originalValues.desc || '',
        offset: originalValues.offset || '',
        value: originalValues.value || ''
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
      targetEvent: ev,
      locals: {
        originalValues: {
          desc: $scope.treeNode.desc,
          offset: $scope.treeNode.offset,
          value: $scope.treeNode.value
        }
      }
    }).then(function(result) {
      $scope.treeNode.desc = result.desc;
      $scope.treeNode.offset = result.offset;
      $scope.treeNode.value = result.value;
      $scope.treeData.updateJson();
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
    var treeNode = $scope.treeNode,
        children = $scope.treeNode.children;
    if (children && children.length > 0) {
      for (var i = 0, len = children.length; i < len; i++) {
        propagateEnable(children[i], treeNode.is_enabled);
      }
    }
    updateEntryCaption();
    $scope.treeData.updateJson();
  };
}]);
