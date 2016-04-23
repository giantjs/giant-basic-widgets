$oop.postpone($basicWidgets, 'Select', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Controllable, 'Controllable'),
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
     * @extends $basicWidgets.Controllable
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
                        selectedOptionWidget.selectOption();
                    }
                }
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
                    'getOptionWidgetByValue',
                    'onChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange');

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
                $basicWidgets.Controllable.afterAdd.call(this);

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
                $basicWidgets.Controllable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Controllable.afterStateOff.call(this, stateName);
            },

            /**
             * @param {string} attributeName
             * @param {*} attributeValue
             * @returns {$basicWidgets.Select}
             */
            addAttribute: function (attributeName, attributeValue) {
                base.addAttribute.call(this, attributeName, attributeValue);
                $basicWidgets.Controllable.addAttribute.call(this, attributeName, attributeValue);
                return this;
            },

            /**
             * @param {string} attributeName
             * @returns {$basicWidgets.Select}
             */
            removeAttribute: function (attributeName) {
                base.removeAttribute.call(this, attributeName);
                $basicWidgets.Controllable.removeAttribute.call(this, attributeName);
                return this;
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
                    .callOnEachItem('selectOption');

                deselectedValues
                    .mapValues(this.getOptionWidgetByValue)
                    .callOnEachItem('deselectOption');

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
             * TODO: Debounce handler.
             * @param {$event.Event} event
             * @ignore
             */
            onOptionSelectedChange: function (event) {
                var affectedOptionWidget = event.sender,
                    affectedValue = affectedOptionWidget.getOptionValue(),
                    selectedValues = this.selectedValues,
                    oldSelectedValues = selectedValues.clone(),
                    isSelected = affectedOptionWidget.isSelected;

                if (isSelected && !this.allowsMultipleOptions) {
                    // when option got selected in a single select
                    // deselecting currently selected options
                    selectedValues.toStringDictionary()
                        .combineWith(this.optionWidgetsByValue.toDictionary())
                        .toCollection()
                        .callOnEachItem('deselectOption');
                }

                // updating selected values
                if (isSelected) {
                    selectedValues.setItem(affectedValue, affectedValue);
                } else {
                    selectedValues.deleteItem(affectedValue);
                }

                if (isSelected || this.allowsMultipleOptions) {
                    // when option got selected in a single select
                    // or selected / deselected in a multi select
                    // triggering event about selected value change
                    this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                        .setPayloadItems({
                            beforeValues: oldSelectedValues.items,
                            afterValues : selectedValues.items
                        })
                        .triggerSync();
                }
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
