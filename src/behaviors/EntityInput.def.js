$oop.postpone($basicWidgets, 'EntityInput', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Implements entity binding for the name & value attributes of an input.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.Input
     * @extends $basicWidgets.EntityWidget
     */
    $basicWidgets.EntityInput = self
        .addPrivateMethods(/** @lends $basicWidgets.EntityInput# */{
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

            /** @private */
            _syncValidityToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    inputValidity = inputDocument.getValidity();

                if (inputValidity) {
                    this.addCssClass('input-valid')
                        .removeCssClass('input-invalid');
                } else {
                    this.addCssClass('input-invalid')
                        .removeCssClass('input-valid');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.EntityInput# */{
            /**
             * Call from host's afterAdd
             */
            afterAdd: function () {
                this._syncInputNameToEntity();
                this._syncInputValueToEntity();
                this._syncValidityToEntity();

                this
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('name'), 'onNameFieldChange')
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('value'), 'onValueFieldChange')
                    .bindToEntity(this.entityKey, $basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, 'onValidityChange');
            },

            /**
             * Call from host's afterRemove
             */
            afterRemove: function () {
                this
                    .unbindFromDelegatedEntityChange(this.entityKey.getFieldKey('name'), 'onNameFieldChange')
                    .unbindFromDelegatedEntityChange(this.entityKey.getFieldKey('value'), 'onValueFieldChange')
                    .unbindFromEntity(this.entityKey, $basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, 'onValidityChange');
            },

            /** @ignore */
            onValueFieldChange: function () {
                this._syncInputValueToEntity();
            },

            /** @ignore */
            onNameFieldChange: function () {
                this._syncInputNameToEntity();
            },

            /** @ignore */
            onValidityChange: function () {
                this._syncValidityToEntity();
            }
        });
});
