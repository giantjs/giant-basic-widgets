$oop.postpone($basicWidgets, 'EntityInput', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Implements entity binding for the name, value, and validity attributes of an input.
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
                    name = inputDocument.getName();

                if (name) {
                    this.setName(name);
                } else {
                    this.clearName();
                }
            },

            /** @private */
            _syncInputValueToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    value = inputDocument.getValue();

                if (typeof value !== 'undefined') {
                    this.setValue(value);
                } else {
                    this.clearValue();
                }
            },

            /** @private */
            _syncValidityToEntity: function () {
                var inputDocument = this.entityKey.toDocument(),
                    isValid = inputDocument.getValidity();

                switch (isValid) {
                case true:
                    this.removeCssClass('input-invalid')
                        .addCssClass('input-valid');
                    break;

                case false:
                    this.removeCssClass('input-valid')
                        .addCssClass('input-invalid');
                    break;

                default:
                    this.removeCssClass('input-valid')
                        .removeCssClass('input-invalid');
                    break;
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
