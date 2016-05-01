$oop.postpone($basicWidgets, 'Select', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Inputable, 'Inputable'),
        slice = Array.prototype.slice;

    /**
     * @name $basicWidgets.Select.create
     * @function
     * @returns {$basicWidgets.Select}
     */

    /**
     * A select dropdown based on the <select> element.
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Inputable
     */
    $basicWidgets.Select = self
        .addPrivateMethods(/** @lends $basicWidgets.Select# */{
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
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {HTMLSelectElement} element
             * @param {boolean} multiple
             * @private
             */
            _multipleSetterProxy: function (element, multiple) {
                element.multiple = multiple;
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {HTMLSelectElement} element
             * @returns {HTMLCollection}
             * @private
             */
            _selectedOptionsGetterProxy: function (element) {
                return element.selectedOptions;
            },

            /** @private */
            _updateMultiplicity: function () {
                var element = this.getElement(),
                    selectedOptionWidget;

                if (element) {
                    // updating DOM
                    this._multipleSetterProxy(element, this.allowsMultipleOptions);
                }

                if (!this.allowsMultipleOptions) {
                    // reducing number of selected values to 1
                    selectedOptionWidget = this.getOptionWidgetByValue(this.selectedValues.getFirstValue());
                    if (selectedOptionWidget) {
                        selectedOptionWidget.select();
                    }
                }
            },

            /** @private */
            _triggerSelectionChange: function () {
                var selectedValuesBefore = this._lastSelectedValues,
                    selectedValuesAfter = this.selectedValues;

                this._lastSelectedValues = this.selectedValues.clone();

                this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                    .setPayloadItems({
                        beforeValues: selectedValuesBefore.items,
                        afterValues : selectedValuesAfter.items
                    })
                    .triggerSync();
            }
        })
        .addMethods(/** @lends $basicWidgets.Select# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethods(
                    '_valueGetterProxy',
                    '_triggerSelectionChange',
                    'getOptionWidgetByValue',
                    'onChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange');

                /**
                 * Selected values before the last option select event.
                 * @type {$data.Collection}
                 * @private
                 */
                this._lastSelectedValues = $data.Collection.create();

                /**
                 * Debouncer for triggering selection change events.
                 * @type {$utils.Debouncer}
                 * @private
                 */
                this._triggerSelectionChangeDebouncer = this._triggerSelectionChange.toDebouncer();

                /**
                 * Whether multiple options may be selected.
                 * @type {boolean}
                 */
                this.allowsMultipleOptions = false;

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
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.Inputable.afterAdd.call(this);

                this._updateMultiplicity();

                this.subscribeTo($basicWidgets.EVENT_OPTION_VALUE_CHANGE, this.onOptionValueChange)
                    .subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, this.onOptionSelectedChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Inputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Inputable.afterStateOff.call(this, stateName);
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
             * @param {string} value
             * @returns {$basicWidgets.Select}
             */
            setValue: function (value) {
                var optionWidget = this.getOptionWidgetByValue(value);
                if (optionWidget) {
                    // matching option found
                    // selecting specified option
                    optionWidget.select();
                }
                return this;
            },

            /**
             * @returns {$basicWidgets.Select}
             */
            clearValue: function () {
                // deselecting all currently selected options
                this.selectedValues.toStringDictionary()
                    .combineWith(this.optionWidgetsByValue.toDictionary())
                    .toCollection()
                    .callOnEachItem('deselect');

                return this;
            },

            /**
             * @returns {string}
             */
            getValue: function () {
                return this.selectedValues.getFirstValue();
            },

            /**
             * Allows select to have multiple options selected.
             * @returns {$basicWidgets.Select}
             */
            allowMultipleSelected: function () {
                this.allowsMultipleOptions = true;
                this._updateMultiplicity();
                return this;
            },

            /**
             * Prevents select to have multiple options selected.
             * TODO: Make sure to trigger selected change events when necessary.
             * @returns {$basicWidgets.Select}
             */
            allowSingleSelectedOnly: function () {
                this.allowsMultipleOptions = false;
                this._updateMultiplicity();
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

                var selectedOptionElements = this._selectedOptionsGetterProxy(this.getElement()),
                    oldSelectedValues = this.selectedValues.toSet(),
                    newSelectedValues = slice.call(selectedOptionElements).toCollection()
                        .mapValues(this._valueGetterProxy)
                        .mapKeys(function (value, key) {
                            return value;
                        })
                        .toSet(),
                    selectedValues = newSelectedValues.subtract(oldSelectedValues).toCollection(),
                    deselectedValues = oldSelectedValues.subtract(newSelectedValues).toCollection();

                selectedValues
                    .mapValues(this.getOptionWidgetByValue)
                    .callOnEachItem('select');

                deselectedValues
                    .mapValues(this.getOptionWidgetByValue)
                    .callOnEachItem('deselect');

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
                    isSelected = affectedOptionWidget.selected;

                if (isSelected && !this.allowsMultipleOptions) {
                    // when option got selected in a single select
                    // deselecting currently selected options
                    selectedValues.toStringDictionary()
                        .combineWith(this.optionWidgetsByValue.toDictionary())
                        .toCollection()
                        .callOnEachItem('deselect');
                }

                // updating selected values
                if (isSelected) {
                    selectedValues.setItem(affectedValue, affectedValue);
                } else {
                    selectedValues.deleteItem(affectedValue);
                }

                // triggering selection changed event
                // debouncing makes sure that a burst of synchronous option select/deselect events
                // does not trigger a lot of selection change events
                this._triggerSelectionChangeDebouncer.schedule(0);
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
