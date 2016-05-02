$oop.postpone($basicWidgets, 'DataSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Select,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.EntityList);

    /**
     * @name $basicWidgets.DataSelect.create
     * @function
     * @param {$entity.FieldKey} optionsKey
     * @returns {$basicWidgets.DataSelect}
     */

    /**
     * Expects the value to be stored in the same document.
     * @class
     * @extends $basicWidgets.Select
     * @extends $basicWidgets.EntityList
     */
    $basicWidgets.DataSelect = self
        .addMethods(/** @lends $basicWidgets.DataSelect# */{
            /**
             * @param {$entity.FieldKey} optionsKey
             * @ignore
             */
            init: function (optionsKey) {
                $assertion.isFieldKey(optionsKey, "Invalid select key");

                base.init.call(this);
                $basicWidgets.EntityList.init.call(this, optionsKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityList.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityList.afterRemove.call(this);
            },

            /**
             * @param {$entity.ItemKey|$entity.ReferenceItemKey} itemKey
             * @returns {$basicWidgets.Optionable}
             * @ignore
             */
            spawnItemWidget: function (itemKey) {
                var itemIdType = itemKey.getItemIdType(),
                    optionKey;

                switch (itemIdType) {
                case 'reference':
                    // reference key is used to create option
                    optionKey = itemKey.referenceKey;
                    return $basicWidgets.DataTextOption.create(
                        optionKey.getFieldKey('description'),
                        optionKey.getFieldKey('value'));

                default:
                    // key / value pair is used to create option
                    return $basicWidgets.DataTextOption.create(itemKey)
                        .setOptionValue(itemKey.itemId);
                }
            },

            /**
             * TODO: Should allow item value to be used.
             * @param {$entity.ItemKey} itemKey
             * @returns {string}
             * @ignore
             */
            spawnItemName: function (itemKey) {
                return itemKey.itemId;
            }
        });
});
