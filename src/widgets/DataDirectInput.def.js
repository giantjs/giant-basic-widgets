$oop.postpone($basicWidgets, 'DataDirectInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DirectInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget);

    /**
     * @name $basicWidgets.DataDirectInput.create
     * @function
     * @param {string} [type]
     * @param {$entity.DocumentKey} inputKey
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
                    inputValue = inputDocument.getInputValue();

                if (typeof inputValue !== 'undefined') {
                    this.setInputValue($utils.Stringifier.stringify(inputValue));
                } else {
                    this.clearInputValue();
                }
            },

            /** @private */
            _syncEntityToInputValue: function () {
                var inputDocument = this.entityKey.toDocument();
                inputDocument.setInputValue(this.getInputValue());
            }
        })
        .addMethods(/** @lends $basicWidgets.DataDirectInput# */{
            /**
             * @param {string} [type]
             * @param {$entity.DocumentKey} inputKey
             * @ignore
             */
            init: function (type, inputKey) {
                $assertion
                    .isDocumentKey(inputKey, "Invalid input key");

                base.init.call(this, type);
                $basicWidgets.EntityWidget.init.call(this, inputKey);

                this.elevateMethod('onInputStateChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._syncInputNameToEntity();
                this._syncInputValueToEntity();

                this
                    .subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange)
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('name'), 'onNameFieldChange')
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('value'), 'onValueFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputValue();
            },

            /** @ignore */
            onValueFieldChange: function () {
                this._syncInputValueToEntity();
            },

            /** @ignore */
            onNameFieldChange: function () {
                this._syncInputNameToEntity();
            }
        });
});

