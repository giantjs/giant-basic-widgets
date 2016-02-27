$oop.postpone($basicWidgets, 'DataDirectInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DirectInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget)
            .addTraitAndExtend($basicWidgets.EntityInput);

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
     * @extends $basicWidgets.EntityInput
     */
    $basicWidgets.DataDirectInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataDirectInput# */{
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
                $basicWidgets.EntityInput.afterAdd.call(this);

                this.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputValue();
            }
        });
});

