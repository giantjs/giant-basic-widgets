$oop.postpone($basicWidgets, 'DataSingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.SingleSelect,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget)
            .addTraitAndExtend($basicWidgets.DataSelect)
            .addTraitAndExtend($basicWidgets.EntityList);

    /**
     * @name $basicWidgets.DataSingleSelect.create
     * @function
     * @param {$entity.FieldKey} valueKey
     * @param {$entity.FieldKey} [optionsKey]
     * @returns {$basicWidgets.DataSingleSelect}
     */

    /**
     * Expects the value to be stored in the same document.
     * @class
     * @extends $basicWidgets.SingleSelect
     * @extends $basicWidgets.EntityWidget
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
                    selectedValueAfter = this.entityKey.toField().getValue(),
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
             * @param {$entity.FieldKey} valueKey
             * @param {$entity.FieldKey} [optionsKey]
             * @ignore
             */
            init: function (valueKey, optionsKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid selected key")
                    .isFieldKeyOptional(optionsKey, "Invalid options key");

                base.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, valueKey);
                if (optionsKey) {
                    $basicWidgets.EntityList.init.call(this, optionsKey);
                }

                this.elevateMethod('onSelectionChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityList.afterAdd.call(this);
                }

                this._syncSelectedToEntity();

                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange)
                    .bindToDelegatedEntityChange(this.entityKey, 'onSelectedFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityList.afterRemove.call(this);
                }
                this.unbindFromDelegatedEntityChange(this.entityKey, 'onSelectedFieldChange');
            },

            /**
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onItemsChange: function (event) {
                $basicWidgets.EntityList.onItemsChange.call(this, event);
                this._syncSelectedToEntity();
            },

            /**
             * @param {$basicWidgets.SelectSelectionChangeEvent} event
             * @ignore
             */
            onSelectionChange: function (event) {
                var selectedKey = this.entityKey,
                    afterValue = event.afterValues.getFirstValue();

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
