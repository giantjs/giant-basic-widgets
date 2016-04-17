$oop.postpone($basicWidgets, 'Select', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.Select.create
     * @function
     * @returns {$basicWidgets.Select}
     */

    /**
     * A select dropdown based on the <select> element.
     * Multiple selected items are not supported ATM.
     * TODO: Multiple select as subclass?
     * @class
     * @extends $basicWidgets.List
     */
    $basicWidgets.Select = self
        .addPrivateMethods(/** @lends $basicWidgets.Select# */{
            /**
             * @param {$widget.Widget} itemWidget
             * @private
             */
            _checkOptionTagName: function (itemWidget) {
                var itemTagName = itemWidget.tagName;

                return itemTagName === 'option' ||
                    itemTagName === 'optgroup';
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @private
             */
            _valueGetterProxy: function (element) {
                return element.value;
            }
        })
        .addMethods(/** @lends $basicWidgets.Select# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.elevateMethods(
                    'onChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange');

                /**
                 * All option widgets indexed by their values.
                 * @type {$data.Collection}
                 */
                this.optionWidgetsByValue = $data.Collection.create();

                /**
                 * Values that are currently selected.
                 * Symmetric key-value pairs.
                 * @type {$data.Collection}
                 */
                this.selectedValues = $data.Collection.create();

                this.setTagName('select');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.subscribeTo($basicWidgets.EVENT_OPTION_VALUE_CHANGE, this.onOptionValueChange)
                    .subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, this.onOptionSelectedChange);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'change', this.onChange);

                // TODO: Initial value from DOM? How will that mix with entity binding in subclass?
            },

            /**
             * Adds option widget to the select.
             * Only allows Option instances the value on which are not yet present in the Select.
             * @param {$basicWidgets.Option} itemWidget
             * @returns {$basicWidgets.Select}
             */
            addItemWidget: function (itemWidget) {
                $assertion
                    .assert($basicWidgets.Option.isBaseOf(itemWidget), "Invalid option widget")
                    .assert(!this.getOptionWidgetByValue(itemWidget.getOptionValue()),
                        "Duplicate option value");

                base.addItemWidget.call(this, itemWidget);

                // adding option to lookup
                this.optionWidgetsByValue.setItem(itemWidget.getOptionValue(), itemWidget);

                return this;
            },

            /**
             * Retrieves the Option instance associated with the specified value.
             * @param {string} optionValue
             * @returns {$basicWidgets.Option}
             */
            getOptionWidgetByValue: function (optionValue) {
                return this.optionWidgetsByValue.getItem(optionValue);
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);

                // identifying affected option
                var affectedValue = this._valueGetterProxy(this.getElement()),
                    affectedOptionWidget = this.getOptionWidgetByValue(affectedValue);

                if (affectedOptionWidget) {
                    // selecting option widget
                    affectedOptionWidget.selectOption();
                }

                link.unlink();
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onOptionValueChange: function (event) {
                var payload = event.payload,
                    beforeValue = payload.beforeValue,
                    afterValue = payload.afterValue,
                    optionWidgetsByValue = this.optionWidgetsByValue,
                    selectedValues = this.selectedValues,
                    affectedOptionWidget = optionWidgetsByValue.getItem(beforeValue),
                    targetOptionWidget = optionWidgetsByValue.getItem(afterValue);

                $assertion.assert(!targetOptionWidget, "Target value already exists");

                // moving option widget in lookup
                optionWidgetsByValue
                    .deleteItem(beforeValue)
                    .setItem(afterValue, affectedOptionWidget);

                if (selectedValues.getItem(beforeValue)) {
                    // select has this option selected
                    // replacing selected value
                    selectedValues
                        .deleteItem(beforeValue)
                        .setItem(afterValue, afterValue);
                }
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onOptionSelectedChange: function (event) {
                var affectedOptionWidget = event.sender,
                    affectedValue = affectedOptionWidget.getOptionValue(),
                    selectedValues = this.selectedValues,
                    oldSelectedValues = selectedValues.clone(),
                    isSelected = affectedOptionWidget.isSelected;

                if (isSelected) {
                    // TODO: This is only for single select
                    // deselecting currently selected options
                    selectedValues.toStringDictionary()
                        .combineWith(this.optionWidgetsByValue.toDictionary())
                        .toCollection()
                        .callOnEachItem('deselectOption');

                    // setting new selected option values
                    selectedValues.setItem(affectedValue, affectedValue);
                } else {
                    selectedValues.deleteItem(affectedValue);
                }

                // triggering event about selected value change
                this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                    .setPayloadItems({
                        beforeValues: oldSelectedValues.items,
                        afterValues : selectedValues.items
                    })
                    .triggerSync();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that the selected value(s) in a select have changed.
         * @constants
         */
        EVENT_SELECT_SELECTION_CHANGE: 'widget.change.select.selection'
    });
}());
