$oop.postpone($basicWidgets, 'SingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable');

    /**
     * @name $basicWidgets.SingleSelect.create
     * @function
     * @returns {$basicWidgets.SingleSelect}
     */

    /**
     * Dom-native select dropdown.
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomInputable
     */
    $basicWidgets.SingleSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.SingleSelect# */{
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
             * @returns {HTMLCollection}
             * @private
             */
            _selectedOptionsGetterProxy: function (element) {
                return element.selectedOptions;
            },

            /** @private */
            _setSelectedValue: function (selectedValueAfter) {
                var selectedValueBefore = this.selectedValue;

                if (selectedValueAfter !== selectedValueBefore) {
                    this.selectedValue = selectedValueAfter;

                    // notifying subscribers
                    // TODO: Use specific event class
                    this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                        .setPayloadItems({
                            beforeValues: selectedValueBefore,
                            afterValues: selectedValueAfter
                        })
                        .triggerSync();
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.SingleSelect# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.setTagName('select');

                this.elevateMethods(
                    '_setSelectedValue',
                    'onChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange');

                /**
                 * All option widgets indexed by their values.
                 * @type {$data.Collection}
                 */
                this.optionWidgetsByValue = $data.Collection.create();

                /**
                 * Currently selected value.
                 * @type {string}
                 */
                this.selectedValue = undefined;

                /**
                 * @type {$utils.Debouncer}
                 * @private
                 */
                this._setSelectedValueDebouncer = this._setSelectedValue.toDebouncer();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);

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
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * Adds option widget to the select.
             * Only allows Option instances the value on which are not yet present in the SingleSelect.
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SingleSelect}
             */
            addItemWidget: function (itemWidget) {
                $assertion
                    .assert(itemWidget && itemWidget.tagName === 'option', "Invalid option widget")
                    .assert(!this.getOptionWidgetByValue(itemWidget.getOptionValue()),
                        "Duplicate option value");

                base.addItemWidget.call(this, itemWidget);

                // adding option to lookup
                this.optionWidgetsByValue.setItem(itemWidget.getOptionValue(), itemWidget);

                return this;
            },

            /**
             * @param {string} value
             * @returns {$basicWidgets.SingleSelect}
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
             * @returns {string}
             */
            getValue: function () {
                return this.selectedValue;
            },

            /**
             * Retrieves the Option instance associated with the specified value.
             * @param {string} optionValue
             * @returns {$basicWidgets.OptionPartial}
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
                    selectedOptionElement = selectedOptionElements[0],
                    selectedValueBefore = this.selectedValue,
                    selectedValueAfter = selectedOptionElement && this._valueGetterProxy(selectedOptionElement);

                if (selectedValueAfter !== selectedValueBefore) {
                    // deselecting current option
                    if (selectedValueBefore) {
                        this.getOptionWidgetByValue(selectedValueBefore).deselect();
                    }

                    // selecting new option
                    if (selectedValueAfter) {
                        this.getOptionWidgetByValue(selectedValueAfter).select();
                    }
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
                    selectedValueBefore = this.selectedValue,
                    affectedOptionWidget = optionWidgetsByValue.getItem(beforeValue),
                    targetOptionWidget = optionWidgetsByValue.getItem(afterValue);

                $assertion.assert(!targetOptionWidget, "Target value already exists");

                // moving option widget in lookup
                optionWidgetsByValue
                    .deleteItem(beforeValue)
                    .setItem(afterValue, affectedOptionWidget);

                // replacing selected value
                if (selectedValueBefore === beforeValue) {
                    this._setSelectedValueDebouncer.schedule(0, afterValue);
                }
            },

            /**
             * TODO: Restore debouncing
             * @param {$event.Event} event
             * @ignore
             */
            onOptionSelectedChange: function (event) {
                var affectedOptionWidget = event.sender,
                    isSelected = affectedOptionWidget.selected,
                    selectedValueBefore = this.selectedValue,
                    selectedValueAfter = isSelected ?
                        affectedOptionWidget.getOptionValue() :
                        undefined;

                // deselecting previously selected option
                if (isSelected && selectedValueBefore) {
                    this.optionWidgetsByValue.getItem(selectedValueBefore)
                        .deselect();
                }

                // setting selected value debounced
                this._setSelectedValueDebouncer.schedule(0, selectedValueAfter);
            }
        });
});

// TODO: Move to partial class (shared by single/multi select)
$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /**
     * Signals that the selected value(s) in a select have changed.
     * @constants
     */
    EVENT_SELECT_SELECTION_CHANGE: 'widget.change.select.selection'
});
