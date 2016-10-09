$oop.postpone($basicWidgets, 'DataSelect', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Maintains selected field key, and provides default item widget & name spawners.
     * Expects to be added to widgets having the EntityList partial.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.EntityList
     * @ignore
     */
    $basicWidgets.DataSelect = self
        .addMethods(/** @lends $basicWidgets.DataSelect# */{
            /**
             * @param {$entity.ItemKey} itemKey
             * @returns {$basicWidgets.OptionPartial}
             * @ignore
             */
            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataOption.create(itemKey)
                    .setOptionValue(itemKey.itemId);
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
