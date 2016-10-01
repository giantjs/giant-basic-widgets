$oop.postpone($basicWidgets, 'DataSelect', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Expects to be added to widgets having the EntityList partial.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.EntityList
     */
    $basicWidgets.DataSelect = self
        .addMethods(/** @lends $basicWidgets.DataSelect# */{
            /**
             * @param {$entity.FieldKey} [selectedKey]
             * @ignore
             */
            init: function (selectedKey) {
                this.elevateMethod('onSelectionChange');

                /**
                 * Identifies collection where the selected values will be stored.
                 * @type {$entity.FieldKey}
                 */
                this.selectedKey = selectedKey;
            },

            /** Call from host's afterAdd */
            afterAdd: function () {
                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange);
            },

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
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onSelectionChange: function (event) {
                var selectedKey = this.selectedKey,
                // TODO: Use domain-specific event class
                    afterValue = event.payload.afterValues;

                if (selectedKey) {
                    selectedKey.toField()
                        .setValue(afterValue);
                }
            }
        });
});
