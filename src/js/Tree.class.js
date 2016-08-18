const angular = require('angular');

class Tree {
  constructor() {
    this.root = [];
    this.config = {
      marginLeftPX: 5,
    };
    this.template = {
      desc: '',
      is_enabled: true,
      is_container_type: false,
      offset: '',
      value: ''
    };
  }

  assignParents(currentNode, parentNode) {
    if (!currentNode) {
      currentNode = this.root;
      parentNode = null;
    }

    currentNode.forEach(childNode => {
      let parents = [];
      
      if (parentNode) {
        angular.copy(parentNode.$$parents, parents);
        parents.push(parentNode.$$hashKey);
      }
      
      childNode.$$parents = parents;

      if (childNode.children) {
        this.assignParents(childNode.children, childNode);
      }
    });
  }

  deleteNode(parentsArr, currentNode, targetNodeId) {
    if (currentNode && currentNode.length > 0) {
      if (parentsArr.length === 0) {
        currentNode.forEach((node, index) => {
          if (node.$$hashKey === targetNodeId) {
            currentNode.splice(index, 1);
          }
        });
      } else {
        var searchParent = parentsArr.shift();
        currentNode.forEach(node => {
          if (node.$$hashKey === searchParent) {
            this.deleteNode(parentsArr, node.children, targetNodeId);
          }
        });
      }
    }
  }

  updateJson() {}
}

export default Tree;