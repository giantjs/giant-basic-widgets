$oop.postpone($basicWidgets, 'SingleOptionInputPartial', function (ns, cn) {
    "use strict";

    var base = $oop.Base,
        self = base.extend(cn);

    /**
     * Maintains state for a single value being selected out of multiple options.
     * Expects to be added to List hosts that also have the SelectableLookupMaintainer trait.
     * Added to hosts like SingleSelect & RadioGroup.
     * TODO: Change terminology to "option"?
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.List
     * @extends $basicWidgets.SelectableLookupMaintainer
     */
    $basicWidgets.SingleOptionInputPartial = self
        .addPrivateMethods(/** @lends $basicWidgets.SingleOptionInputPartial# */{
            /** @private */
            _syncItemsToSelection: function () {
                var selectedValueBefore = this._lastSelectedValue,
                    selectedValueAfter = this.selectedValue,
                    selectedOption,
                    deselectedOption;

                if (selectedValueAfter !== selectedValueBefore) {
                    selectedOption = this.getItemWidgetByValue(selectedValueAfter);
                    deselectedOption = this.getItemWidgetByValue(selectedValueBefore);

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
        .addMethods(/** @lends $basicWidgets.SingleOptionInputPartial# */{
            /** Call from host's init */
            init: function () {
                this.elevateMethods(
                    '_updateLastSelectedValue',
                    'onSelectableStateChange');

                /**
                 * Option vaue selected before the current one.
                 * @type {string}
                 * @private
                 */
                this._lastSelectedValue = undefined;

                /**
                 * Debouncer for updating last selected value.
                 * @type {$utils.Debouncer}
                 * @private
                 */
                this._updateLastSelectedValueDebouncer = this._updateLastSelectedValue.toDebouncer();

                /**
                 * Value of the currently selected option.
                 * @type {string}
                 */
                this.selectedValue = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                this._syncItemsToSelection();
                this.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, this.onSelectableStateChange);
            },

            /**
             * Extracts selectable widget from specified item widget.
             * Defaults to the item widget.
             * TODO: Move this into a lower-level select-like partial / interface.
             * @param {$widget.Widget|$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.Selectable}
             */
            extractSelectableFromItemWidget: function (itemWidget) {
                return itemWidget;
            },

            /**
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SingleOptionInputPartial}
             */
            addItemWidget: function (itemWidget) {
                if (itemWidget.selected) {
                    this.selectedValue = itemWidget.getValue();
                    this._updateLastSelectedValueDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * @param {$basicWidgets.Selectable} itemWidget Supposed to contain one (and only one) BinaryInput.
             * @returns {$basicWidgets.SingleOptionInputPartial}
             */
            removeItemWidget: function (itemWidget) {
                if (itemWidget.selected) {
                    this.selectedValue = undefined;
                    this._updateLastSelectedValueDebouncer.schedule(0);
                }
                return this;
            },

            /**
             * @param {string} value
             * @returns {$basicWidgets.SingleOptionInputPartial}
             */
            setValue: function (value) {
                var selectedValue = this.selectedValue;
                if (value !== selectedValue) {
                    this.selectedValue = value;
                    this._updateLastSelectedValueDebouncer.schedule(0);
                    this._syncItemsToSelection();
                }
                return this;
            },

            /** @returns {string} */
            getValue: function () {
                return this.selectedValue;
            },

            /**
             * Don't forget to join with other traits handlers of the same name.
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                var beforeValue = event.beforeValue,
                    afterValue = event.afterValue,
                    selectedValueBefore = this.selectedValue;

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
            onSelectableStateChange: function (event) {
                var affectedOptionWidget = event.sender,
                    isSelected = affectedOptionWidget.selected,
                    selectedValueBefore = this.selectedValue,
                    selectedValueAfter = isSelected ?
                        affectedOptionWidget.getValue() :
                        undefined;

                // deselecting previously selected option
                if (isSelected && selectedValueBefore) {
                    this.itemWidgetsByValue.getItem(selectedValueBefore)
                        .deselect();
                }

                // updating selected value
                this.selectedValue = selectedValueAfter;
                this._updateLastSelectedValueDebouncer.schedule(0);
            }
        });
});
