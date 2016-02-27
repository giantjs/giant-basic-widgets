$oop.postpone($basicWidgets, 'DataBinaryInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.BinaryInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget)
            .addTraitAndExtend($basicWidgets.EntityInput);

    /**
     * @name $basicWidgets.DataBinaryInput.create
     * @function
     * @param {string} [inputType]
     * @param {$entity.DocumentKey} inputKey
     * @returns {$basicWidgets.DataBinaryInput}
     */

    /**
     * @class
     * @extends $basicWidgets.BinaryInput
     * @extends $basicWidgets.EntityWidget
     * @extends $basicWidgets.EntityInput
     */
    $basicWidgets.DataBinaryInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataBinaryInput# */{
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
             * @param {string} [inputType]
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
                $basicWidgets.EntityInput.afterAdd.call(this);

                this._syncInputStateToEntity();

                this
                    .subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange)
                    .bindToDelegatedEntityChange(this.entityKey.getFieldKey('state'), 'onStateFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);

                this.unbindFromDelegatedEntityChange(this.entityKey.getFieldKey('state'), 'onStateFieldChange');
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputState();
            },

            /** @ignore */
            onStateFieldChange: function () {
                this._syncInputStateToEntity();
            }
        });
});
