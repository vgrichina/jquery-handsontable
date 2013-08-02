function HandsontableNumericEditorClass(instance) {
  HandsontableTextEditorClass.call(this, instance);
}

Handsontable.helper.inherit(HandsontableNumericEditorClass, HandsontableTextEditorClass);

HandsontableNumericEditorClass.prototype.bindTemporaryEvents = function (td, row, col, prop, value, cellProperties){
  HandsontableTextEditorClass.prototype.bindTemporaryEvents.apply(this, arguments);
  numeral.language(cellProperties.language);

  if(cellProperties.format && cellProperties.format.length > 0){
    this.originalValue = numeral(value).format(cellProperties.format);
  }

  this.cellProperties = cellProperties;
};

HandsontableNumericEditorClass.prototype.finishEditing = function(isCancelled, ctrlDown){
  var hasValidator = false;

  if (this.state == this.STATE_WAITING || this.state == this.STATE_FINISHED) {
    return;
  }

  if (this.state == this.STATE_EDITING) {
    var val;

    if (isCancelled) {
      val = [
        [this.originalValue]
      ];
    } else {
      var formattedValue = $.trim(this.TEXTAREA.value);
      var unformattedValue;

      numeral.language(this.cellProperties.language);
      unformattedValue = numeral().unformat(formattedValue);

      val = [
        [unformattedValue]
      ];
    }

    hasValidator = this.instance.getCellMeta(this.row, this.col).validator;

    if (hasValidator) {
      this.state = this.STATE_WAITING;
      var that = this;
      this.instance.addHookOnce('afterValidate', function (result) {
        that.state = that.STATE_FINISHED;
        that.discardEditor(result);
      });
    }
    this.saveValue(val, ctrlDown);
  }

  if (!hasValidator) {
    this.state = this.STATE_FINISHED;
    this.discardEditor();
  }
};

Handsontable.NumericEditor = function (instance, td, row, col, prop, value, cellProperties) {
  if (!instance.numericEditor) {
    instance.numericEditor = new HandsontableNumericEditorClass(instance);
  }
  if (instance.numericEditor.state === instance.numericEditor.STATE_VIRGIN || instance.numericEditor.state === instance.numericEditor.STATE_FINISHED) {
    instance.numericEditor.bindTemporaryEvents(td, row, col, prop, value, cellProperties);
  }
  return function (isCancelled) {
    instance.numericEditor.finishEditing(isCancelled);
  }
};
