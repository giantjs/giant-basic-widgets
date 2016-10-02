$oop.postpone($basicWidgets, 'DataSingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.SingleSelect,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.DataSelect)
            .addTraitAndExtend($basicWidgets.EntityList);

    /**
     * @name $basicWidgets.DataSingleSelect.create
     * @function
     * @param {$entity.FieldKey} optionsKey
     * @param {$entity.FieldKey} [selectedKey]
     * @returns {$basicWidgets.DataSingleSelect}
     */

    /**
     * Expects the value to be stored in the same document.
     * @class
     * @extends $basicWidgets.SingleSelect
     * @extends $basicWidgets.DataSelect
     * @extends $basicWidgets.EntityList
     */
    $basicWidgets.DataSingleSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.DataSingleSelect# */{
            /**
             * TODO: Do this via changing selectedValue.
             * @private
             */
            _syncSelectedToEntity: function () {
                var selectedValueBefore = this.selectedValue,
                    selectedValueAfter = this.selectedKey.toField().getValue(),
                    selectedOption,
                    deselectedOption;

                if (selectedValueAfter !== selectedValueBefore) {
                    selectedOption = this.getOptionWidgetByValue(selectedValueAfter);
                    deselectedOption = this.getOptionWidgetByValue(selectedValueBefore);

                    if (selectedOption) {
                        selectedOption.select();
                    }

                    if (deselectedOption) {
                        deselectedOption.deselect();
                    }
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DataSingleSelect# */{
            /**
             * @param {$entity.FieldKey} optionsKey
             * @param {$entity.FieldKey} [selectedKey]
             * @ignore
             */
            init: function (optionsKey, selectedKey) {
                $assertion
                    .isFieldKey(optionsKey, "Invalid options key")
                    .isFieldKeyOptional(selectedKey, "Invalid selected key");

                base.init.call(this);
                $basicWidgets.EntityList.init.call(this, optionsKey);
                $basicWidgets.DataSelect.init.call(this, selectedKey);

                this.elevateMethod('onSelectionChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityList.afterAdd.call(this);

                this._syncSelectedToEntity();

                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange)
                    .bindToDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityList.afterRemove.call(this);

                this.unbindFromDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onSelectionChange: function (event) {
                var selectedKey = this.selectedKey,
                    afterValue = event.payload.afterValues;

                if (selectedKey) {
                    selectedKey.toField()
                        .setValue(afterValue);
                }
            },

            /** @ignore */
            onSelectedFieldChange: function () {
                this._syncSelectedToEntity();
            }
        });
});
