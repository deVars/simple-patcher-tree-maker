const angular = require(`angular`);
export default app => {
  app.component(`treeContainer`, {
    controller: TreeContainerController,
    bindings: {
      treeData: `=`,
      parentNode: `=`,
      treeNode: `=`
    },
    template: require(`./treeContainer.template.html`)
  });
};

class TreeContainerController {
  constructor() {}

  addNode() {
    var tempNode = {},
        parents = [];

    angular.copy(this.treeData.NODE_TEMPLATE, tempNode);

    if (this.parentNode && this.parentNode.$$parents) {
      angular.copy(this.parentNode.$$parents, parents);
      parents.push(this.parentNode.$$hashKey);
    }

    tempNode.$$parents = parents;
    this.treeNode.push(tempNode);
    this.treeData.updateJson();
  }
}