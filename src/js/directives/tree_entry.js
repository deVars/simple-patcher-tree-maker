export default app => {
  const angular = require('angular');

  app.directive('treeEntry', ['$compile', '$http', '$sce', function($compile, $http, $sce) {
    var htmlTreeTemplate = $sce.getTrustedHtml(
      $sce.trustAsHtml(require(`../../views/templates/tree_entry.html`))
    );	
    
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
};
