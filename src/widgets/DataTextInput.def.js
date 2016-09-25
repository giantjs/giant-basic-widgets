$oop.postpone($basicWidgets, 'DataTextInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.TextInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget)
            .addTraitAndExtend($basicWidgets.EntityInput);

    /**
     * @name $basicWidgets.DataTextInput.create
     * @function
     * @param {string} [type]
     * @param {$entity.DocumentKey} inputKey
     * @returns {$basicWidgets.DataTextInput}
     */

    /**
     * @class
     * @extends $basicWidgets.TextInput
     * @extends $basicWidgets.EntityWidget
     * @extends $basicWidgets.EntityInput
     */
    $basicWidgets.DataTextInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataTextInput# */{
            /** @private */
            _syncEntityToInputValue: function () {
                this.valueKey.toField().setValue(this.value);
            }
        })
        .addMethods(/** @lends $basicWidgets.DataTextInput# */{
            /**
             * @param {string} [inputType]
             * @param {$entity.FieldKey} nameKey
             * @param {$entity.FieldKey} valueKey
             * @ignore
             */
            init: function (inputType, valueKey, nameKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid input value key")
                    .isFieldKeyOptional(nameKey, "Invalid input name key");

                base.init.call(this, inputType);
                $basicWidgets.EntityWidget.init.call(this, valueKey);
                $basicWidgets.EntityInput.init.call(this, valueKey, nameKey);

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

