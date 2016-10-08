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
             * Removes option widget from select.
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SelectPartial}
             */
            removeItemWidget: function (itemWidget) {
                // removing option from lookup
                this.optionWidgetsByValue.deleteItem(itemWidget.getOptionValue());

                return this;
            },

            /**
             * Shorthand for adding an option to the select.
             * @param {string} childName
             * @param {string} optionValue
             * @param {string|$utils.Stringifiable} optionText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.SelectPartial}
             */
            addOption: function (childName, optionValue, optionText, selected) {
                var optionWidget = $basicWidgets.Option.create()
                    .setChildName(childName)
                    .setOptionValue(optionValue)
                    .setContentString(optionText);

                if (selected) {
                    optionWidget.select();
                }

                this.addItemWidget(optionWidget);

                return this;
            },

            /**
             * Shorthand for adding a locale-bound option to the select.
             * @param {string} childName
             * @param {string} optionValue
             * @param {string|$utils.Stringifiable} optionText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.SelectPartial}
             */
            addLocaleOption: function (childName, optionValue, optionText, selected) {
                var optionWidget = $basicWidgets.LocaleOption.create()
                    .setChildName(childName)
                    .setOptionValue(optionValue)
                    .setOriginalContentString(optionText);

                if (selected) {
                    optionWidget.select();
                }

                this.addItemWidget(optionWidget);

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
