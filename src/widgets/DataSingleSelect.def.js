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
            /** @private */
            _syncSelectedToEntity: function () {
                var selectedKey = this.selectedKey,
                    valueBefore = this.selectedValue,
                    valueAfter = selectedKey.toEntity().getNode();

                if (valueAfter !== valueBefore) {
                    this.setValue(valueAfter);
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
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityList.afterAdd.call(this);
                $basicWidgets.DataSelect.afterAdd.call(this);

                this._syncSelectedToEntity();
                this.bindToDelegatedEntityChange(this.selectedKey, 'onSelectedFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityList.afterRemove.call(this);
            },

            /** @ignore */
            onSelectedFieldChange: function () {
                this._syncSelectedToEntity();
            }
        });
});
