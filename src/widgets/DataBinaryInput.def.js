$oop.postpone($basicWidgets, 'DataBinaryInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.BinaryInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget);

    /**
     * @name $basicWidgets.DataBinaryInput.create
     * @function
     * @param {string} [inputType='checkbox']
     * @param {$entity.DocumentKey} inputKey
     * @returns {$basicWidgets.DataBinaryInput}
     */

    /**
     * @class
     * @extends $basicWidgets.BinaryInput
     * @extends $basicWidgets.EntityWidget
     */
    $basicWidgets.DataBinaryInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataBinaryInput# */{
            /** @private */
            _syncInputNameToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputName = inputDocument.getInputName();

                if (inputName) {
                    this.setInputName(inputName);
                } else {
                    this.clearInputName();
                }
            },

            /** @private */
            _syncInputValueToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputValue = inputDocument.getInputValue();

                if (typeof inputValue !== 'undefined') {
                    this.setInputValue(inputValue);
                } else {
                    this.clearInputValue();
                }
            },

            /**
             * Syncs input value to value entity.
             * @private
             */
            _syncInputStateToEntity: function () {
                var inputDocument = this.entityKey.toDocument();

                if (inputDocument.getInputState()) {
                    this.setChecked(true);
                } else {
                    this.clearChecked();
                }
            },

            /** @private */
            _syncEntityToInputState: function () {
                var inputDocument = this.entityKey.toDocument();
                inputDocument.setInputState(this.getChecked());
            }
        })
        .addMethods(/** @lends $basicWidgets.DataBinaryInput# */{
            /**
             * @param {string} [inputType='checkbox']
             * @param {$entity.DocumentKey} inputKey
             * @ignore
             */
            init: function (inputType, inputKey) {
                $assertion
                    .isDocumentKey(inputKey, "Invalid input key");

                base.init.call(this, inputType);
                $basicWidgets.EntityWidget.init.call(this, inputKey);

                this.elevateMethod('onInputStateChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._syncInputNameToEntity();
                this._syncInputValueToEntity();
                this._syncInputStateToEntity();

                this
                    .subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange)
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('name'), 'onNameFieldChange')
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('value'), 'onValueFieldChange')
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('state'), 'onStateFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputState();
            },

            /** @ignore */
            onNameFieldChange: function () {
                this._syncInputNameToEntity();
            },

            /** @ignore */
            onValueFieldChange: function () {
                this._syncInputValueToEntity();
            },

            /** @ignore */
            onStateFieldChange: function () {
                this._syncInputStateToEntity();
            }
        });
});
