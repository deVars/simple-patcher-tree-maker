export default app => {
  const angular = require('angular');
  
  app.controller('mainCtrl', ['$mdDialog', '$mdSidenav', '$mdUtil', '$scope', '$timeout', 
      function($mdDialog, $mdSidenav, $mdUtil, $scope, $timeout) {
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
        template: require(`../../views/dialogs/load_JSON.html`),
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

    $scope.toggleJSONView = $mdUtil.debounce(function() {
      $mdSidenav('json-view').toggle();
    }, 200);

    $scope.togglePrettify = function() {
      $scope.data.tree.config.prettify = !$scope.data.tree.config.prettify;
      $scope.data.tree.updateJson();
    };
  }]);
};

