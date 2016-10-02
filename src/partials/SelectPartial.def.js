$oop.postpone($basicWidgets, 'SelectPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Maintains associations between option widgets and their values.
     * Expects to be added to List widgets.
     * TODO: Rename to OptionWidgetLookupMaintainer?
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.List
     * @ignore
     */
    $basicWidgets.SelectPartial = self
        .addMethods(/** @lends $basicWidgets.SelectPartial# */{
            /** @ignore */
            init: function () {
                this.setTagName('select');

                /**
                 * All option widgets indexed by their values.
                 * Holds instances of OptionPartial.
                 * @type {$data.Collection}
                 */
                this.optionWidgetsByValue = $data.Collection.create();
            },

            /**
             * Adds option widget to the select.
             * Only allows Option instances the value on which are not yet present in the SelectPartial.
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SelectPartial}
             */
            addItemWidget: function (itemWidget) {
                $assertion
                    .assert(itemWidget && itemWidget.tagName === 'option', "Invalid option widget")
                    .assert(!this.getOptionWidgetByValue(itemWidget.getOptionValue()),
                        "Duplicate option value");

                // adding option to lookup
                this.optionWidgetsByValue.setItem(itemWidget.getOptionValue(), itemWidget);

                return this;
            },

            /**
             * Retrieves the Option instance associated with the specified value.
             * @param {string} optionValue
             * @returns {$basicWidgets.OptionPartial}
             */
            getOptionWidgetByValue: function (optionValue) {
                return this.optionWidgetsByValue.getItem(optionValue);
            }
        });
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /**
     * Signals that the selected value(s) in a select have changed.
     * @constants
     */
    EVENT_SELECT_SELECTION_CHANGE: 'widget.change.select.selection'
});
