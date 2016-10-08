$oop.postpone($basicWidgets, 'DataSingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.SingleSelect,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.DataSelect)
            .addTraitAndExtend($basicWidgets.EntityList);

    /**
     * @name $basicWidgets.DataSingleSelect.create
     * @function
     * @param {$entity.FieldKey} selectedKey
     * @param {$entity.FieldKey} [optionsKey]
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
             * @param {$entity.FieldKey} selectedKey
             * @param {$entity.FieldKey} [optionsKey]
             * @ignore
             */
            init: function (selectedKey, optionsKey) {
                $assertion
                    .isFieldKey(selectedKey, "Invalid selected key")
                    .isFieldKeyOptional(optionsKey, "Invalid options key");

                base.init.call(this);
                if (optionsKey) {
                    $basicWidgets.EntityList.init.call(this, optionsKey);
                } else {
                    $entity.EntityBound.init.call(this);
                }
                $basicWidgets.DataSelect.init.call(this, selectedKey);

                this.elevateMethod('onSelectionChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                if (this.entityKey) {
                    $basicWidgets.EntityList.afterAdd.call(this);
                }

                this._syncSelectedToEntity();

                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange)
                    .bindToDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                if (this.entityKey) {
                    $basicWidgets.EntityList.afterRemove.call(this);
                }
                this.unbindFromDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
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
                var selectedKey = this.selectedKey,
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
