import {LABEL_ENABLED, LABEL_DISABLED, LABEL_NODETYPE_BRANCH, LABEL_NODETYPE_LEAF} from "../constants";
import EditTreeNodeController from "./edit.controller";
const angular = require(`angular`);

export default app => {
  app.directive(`treeEntry`, function($compile, $http, $sce) {
    var htmlTreeTemplate = $sce.getTrustedHtml(
      $sce.trustAsHtml(require(`./treeEntry.template.html`))
    );	
    
    return {
      restrict: `E`,
      controller: TreeEntryController,
      controllerAs: `$ctrl`,
      scope: {},
      bindToController: {
        treeData: `=`,
        treeNode: `=`
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
  });
};

class TreeEntryController {
  constructor($mdDialog) {
    this.dialog = $mdDialog;
    this.switchLabel = undefined;
    this.nodeType = undefined;

    this.updateNodeTypeLabel();
    this.updateSwitchLabel();
  }

  updateNodeTypeLabel() {
    if (this.treeNode.is_container_type) {
      // set as undefined so it won't get generated
      if (angular.isString(this.treeNode.offset)) {
        this.treeNode.offset = undefined;
        this.treeNode.value = undefined;
      }

      this.treeNode.children = this.treeNode.children || [];

      this.nodeType = LABEL_NODETYPE_BRANCH;
    } else {
      // set as undefined so it won't get generated
      if (this.treeNode.children) {
        this.treeNode.children = undefined;
      }

      this.treeNode.offset = this.treeNode.offset || '';
      this.treeNode.value = this.treeNode.value || '';

      this.nodeType = LABEL_NODETYPE_LEAF;
    }
  }

  updateSwitchLabel() {
    var treeNode = this.treeNode;
    if (angular.isDefined(treeNode.is_enabled)) {
      treeNode.is_enabled = treeNode.is_enabled;
    } else {
      treeNode.is_enabled = true;
    }
    if (treeNode.is_enabled) {
      this.switchLabel = LABEL_ENABLED;
    } else {
      this.switchLabel = LABEL_DISABLED;
    }
  }

  /**
   * propagates enable/disable flag on the children
   * i.e. a disabled parent automatically disables its children
   */
  propagateEnable(node, isEnable) {
    node.is_enabled = isEnable;
    node.$$is_hidden_by_parent = !isEnable;
    if (node.children && node.children.length > 0) {
      for (var i = 0, len = node.children.length; i < len; i++) {
        this.propagateEnable(node.children[i], isEnable);
      }
    }
  }

  showEditDialog(ev) {
    let ctrl = this;
    ctrl.dialog.show({
      controller: EditTreeNodeController,
      controllerAs: `$ctrl`,
      template: require(`./edit.template.html`),
      targetEvent: ev,
      fullscreen: true,
      locals: {
        originalValues: {
          desc: ctrl.treeNode.desc,
          offset: ctrl.treeNode.offset,
          value: ctrl.treeNode.value
        }
      }
    }).then(function(result) {
      ctrl.treeNode.desc = result.desc;
      ctrl.treeNode.offset = result.offset;
      ctrl.treeNode.value = result.value;
      ctrl.treeData.updateJson();
    });
  }

  removeNode() {
    this.treeData.deleteNode(this.treeNode.$$parents, this.treeData.root, this.treeNode.$$hashKey);
    this.treeData.updateJson();
  }

  toggleNodeType() {
    this.updateNodeTypeLabel();
    this.treeData.updateJson();
  }

  toggleEntry() {
    var treeNode = this.treeNode,
        children = this.treeNode.children;
    if (children && children.length > 0) {
      for (var i = 0, len = children.length; i < len; i++) {
        this.propagateEnable(children[i], treeNode.is_enabled);
      }
    }
    this.updateSwitchLabel();
    this.treeData.updateJson();
  }
}
