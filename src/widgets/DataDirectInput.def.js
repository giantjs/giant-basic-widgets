$oop.postpone($basicWidgets, 'DataDirectInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DirectInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget);

    /**
     * @name $basicWidgets.DataDirectInput.create
     * @function
     * @param {$entity.DocumentKey} inputKey
     * @param {$entity.FieldKey} formValuesKey
     * @returns {$basicWidgets.DataDirectInput}
     */

    /**
     * @class
     * @extends $basicWidgets.DirectInput
     * @extends $basicWidgets.EntityWidget
     */
    $basicWidgets.DataDirectInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataDirectInput# */{
            /** @private */
            _updateDisabledState: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputName = inputDocument.getInputName();

                if (inputName) {
                    this.enableBy('input-name-availability');
                } else {
                    this.disableBy('input-name-availability');
                }
            },

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

            /**
             * Syncs input value to value entity.
             * @private
             */
            _syncInputValueToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputName = inputDocument.getInputName(),
                    formValueKey,
                    inputValue;

                if (inputName) {
                    formValueKey = this.formValuesKey.getItemKey(inputName);
                    inputValue = formValueKey.toItem().getValue();
                    this.setInputValue($utils.Stringifier.stringify(inputValue));
                } else {
                    this.clearInputValue();
                }
            },

            /** @private */
            _syncEntityToInputValue: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputName = inputDocument.getInputName();

                if (inputName) {
                    this.formValuesKey.getItemKey(inputName).toItem()
                        .setValue(this.getInputValue());
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DataDirectInput# */{
            /**
             * @param {$entity.DocumentKey} inputKey
             * @param {$entity.FieldKey} formValuesKey
             * @ignore
             */
            init: function (inputKey, formValuesKey) {
                $assertion
                    .isDocumentKey(inputKey, "Invalid input key")
                    .isFieldKey(formValuesKey, "Invalid values key");

                base.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, inputKey);

                this.elevateMethod('onInputStateChange');

                /**
                 * Identifies collection holding form values.
                 * @type {$entity.FieldKey}
                 */
                this.formValuesKey = formValuesKey;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateDisabledState();
                this._syncInputValueToEntity();

                this
                    .subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange)
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('name'), 'onNameFieldChange')
                    .bindToEntityChange(this.formValuesKey, 'onFormValuesChange');
            },

            /** @ignore */
            afterRemove: function() {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /**
             * @param {string} inputName
             * @returns {$basicWidgets.DataDirectInput}
             */
            setInputName: function (inputName) {
                base.setInputName.call(this, inputName);
                this._syncInputValueToEntity();
                return this;
            },

            /**
             * @returns {$basicWidgets.DataDirectInput}
             */
            clearInputName: function () {
                base.clearInputName.call(this);
                this._syncInputValueToEntity();
                return this;
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputValue();
            },

            /** @ignore */
            onFormValuesChange: function () {
                this._syncInputValueToEntity();
            },

            /** @ignore */
            onNameFieldChange: function () {
                this._updateDisabledState();
                this._syncInputNameToEntity();
            }
        });
});

