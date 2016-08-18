const angular = require('angular');
const Tree = require('../Tree.class');

export default app => {
  app.component('app', {
    controller: AppController,
    template: require('./app.template.html')
  });
};

class AppController {
  constructor($mdDialog, $mdSidenav, $mdUtil, $scope, $timeout) {
    this.tree = new Tree();
    this.dialog = $mdDialog;
    this.sideNav = $mdSidenav;
    this.mdUtil = $mdUtil;
    this.timeout = $timeout;
  }

  loadJSON(event) {
    this.dialog.show({
      controller: LoadJSONController,
      controllerAs: `$ctrl`,
      template: require(`./loadJson.template.html`),
      targetEvent: event
    }).then(result => {
      this.tree.root = angular.fromJson(result);
        this.tree.updateJson();
        this.timeout(() => {
          this.tree.assignParents();
        }, 500);
    });
  }

  toggleJSONView() {
    let vm = this;
    this.mdUtil.debounce(function() {
      vm.sideNav(`json-view`).toggle();
    }, 200)();
  }
}

/*@ngInject*/
class LoadJSONController {
  constructor($mdDialog) {
    this.dialog = $mdDialog;
    this.data = {}
  }

  load() {
    this.dialog.hide(this.data.json);
  }

  cancel() {
    this.dialog.cancel();
  }
}
