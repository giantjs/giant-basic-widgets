$oop.postpone($basicWidgets, 'SelectableLookupMaintainer', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Maintains associations between option widgets and their values.
     * Expects to be added to List widgets.
     * TODO: Updating lookup when values change.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.List
     * @ignore
     */
    $basicWidgets.SelectableLookupMaintainer = self
        .addMethods(/** @lends $basicWidgets.SelectableLookupMaintainer# */{
            /** @ignore */
            init: function () {
                /**
                 * All option widgets indexed by their values.
                 * Holds instances of Selectable.
                 * @type {$data.Collection}
                 */
                this.itemWidgetsByValue = $data.Collection.create();
            },

            /**
             * Adds item widget to lookup.
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SelectableLookupMaintainer}
             */
            addItemWidget: function (itemWidget) {
                $assertion
                    .assert(!this.getItemWidgetByValue(itemWidget.getValue()),
                        "Duplicate option value");

                // adding option to lookup
                this.itemWidgetsByValue.setItem(itemWidget.getValue(), itemWidget);

                return this;
            },

            /**
             * Removes item widget from lookup.
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SelectableLookupMaintainer}
             */
            removeItemWidget: function (itemWidget) {
                // removing selectable from lookup
                this.itemWidgetsByValue.deleteItem(itemWidget.getValue());

                return this;
            },

            /**
             * Retrieves the Selectable instance associated with the specified value.
             * @param {string} optionValue
             * @returns {$basicWidgets.Selectable}
             */
            getItemWidgetByValue: function (optionValue) {
                return this.itemWidgetsByValue.getItem(optionValue);
            }
        });
});
