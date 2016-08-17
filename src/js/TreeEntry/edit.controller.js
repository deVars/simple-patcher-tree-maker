/*@ngInject*/
class EditTreeNodeController {
  constructor($mdDialog, originalValues) {
    this.dialog = $mdDialog;
    this.data = {
      desc: originalValues.desc || '',
      offset: originalValues.offset || '',
      value: originalValues.value || ''
    };
  }

  submit() {
    this.dialog.hide(this.data);
  }

  cancel() {
    this.dialog.cancel();
  }
}

export default EditTreeNodeController;

