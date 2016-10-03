$oop.postpone($basicWidgets, 'SingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTrait($basicWidgets.SelectPartial)
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
     * @extends $basicWidgets.SelectPartial
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
            _syncOptionsToSelection: function () {
                var selectedValueBefore = this._lastSelectedValue,
                    selectedValueAfter = this.selectedValue,
                    selectedOption,
                    deselectedOption;

                if (selectedValueAfter !== selectedValueBefore) {
                    selectedOption = this.getOptionWidgetByValue(selectedValueAfter);
                    deselectedOption = this.getOptionWidgetByValue(selectedValueBefore);

                    if (selectedOption) {
                        selectedOption.select();
                    }

                    if (deselectedOption) {
                        deselectedOption.deselect();
                    }
                }
            },

            /** @private */
            _updateLastSelectedValue: function () {
                var selectedValueBefore = this._lastSelectedValue,
                    selectedValueAfter = this.selectedValue;

                if (selectedValueAfter !== selectedValueBefore) {
                    this._lastSelectedValue = selectedValueAfter;

                    this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                        .setBeforeValues([selectedValueBefore].toCollection())
                        .setAfterValues([selectedValueAfter].toCollection())
                        .triggerSync();
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.SingleSelect# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.SelectPartial.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethods(
                    '_updateLastSelectedValue',
                    'onChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange');

                /**
                 * Selected value before the last option select event.
                 * @type {string}
                 * @private
                 */
                this._lastSelectedValue = undefined;

                /**
                 * @type {$utils.Debouncer}
                 * @private
                 */
                this._updateLastSelectedValueDebouncer = this._updateLastSelectedValue.toDebouncer();

                /**
                 * Currently selected value.
                 * @type {string}
                 */
                this.selectedValue = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);

                this._syncOptionsToSelection();

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
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SingleSelect}
             */
            addItemWidget: function (itemWidget) {
                base.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectPartial.addItemWidget.call(this, itemWidget);

                if (itemWidget.selected) {
                    // TODO: Add test
                    this.selectedValue = itemWidget.getOptionValue();
                    this._updateLastSelectedValueDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * @param {string} value
             * @returns {$basicWidgets.SingleSelect}
             */
            setValue: function (value) {
                var selectedValue = this.selectedValue;
                if (value !== selectedValue) {
                    this.selectedValue = value;
                    this._updateLastSelectedValueDebouncer.schedule(0);
                    this._syncOptionsToSelection();
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
                    this.selectedValue = afterValue;
                    this._updateLastSelectedValueDebouncer.schedule(0, afterValue);
                }
            },

            /**
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

                // updating selected value
                this.selectedValue = selectedValueAfter;
                this._updateLastSelectedValueDebouncer.schedule(0);
            }
        });
});
