export default app => {
  app.directive('treeContainer', [function() {
    return {
      restrict: 'E',
      controller: 'treeContainerCtrl',
      scope: {
        treeData: '=',
        parentNode: '=',
        treeNode: '='
      },
      template: require('../../views/templates/tree_container.html')
    };
  }]);
};
