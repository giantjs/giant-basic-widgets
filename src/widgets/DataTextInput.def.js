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
     * Entity-bound text input field.
     * TODO: Add setter for nameKey?
     * TODO: Make valueKey optional, too?
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
             * @param {$entity.FieldKey} valueKey
             * @param {$entity.FieldKey} [nameKey]
             * @ignore
             */
            init: function (inputType, valueKey, nameKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid input value key")
                    .isFieldKeyOptional(nameKey, "Invalid input name key");

                base.init.call(this, inputType);
                $basicWidgets.EntityWidget.init.call(this, valueKey);
                $basicWidgets.EntityInput.init.call(this, valueKey, nameKey);

                this.elevateMethod('onInputValueChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityInput.afterAdd.call(this);

                this.subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, this.onInputValueChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);
            },

            /** @ignore */
            onInputValueChange: function () {
                this._syncEntityToInputValue();
            }
        });
});

