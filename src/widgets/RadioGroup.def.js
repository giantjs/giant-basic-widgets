$oop.postpone($basicWidgets, 'RadioGroup', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.SelectableLookupMaintainer)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable');

    /**
     * @name $basicWidgets.RadioGroup.create
     * @function
     * @returns {$basicWidgets.RadioGroup}
     */

    /**
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.SelectableLookupMaintainer
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.RadioGroup = self
        .addPrivateMethods(/** @lends $basicWidgets.RadioGroup# */{
            /**
             * TODO: Same as in SingleSelect.
             * @private
             */
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

            /**
             * TODO: Same as in SingleSelect.
             * @private
             */
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
        .addMethods(/** @lends $basicWidgets.RadioGroup# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.SelectableLookupMaintainer.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                // TODO: Common w/ SingleSelect
                // SingleChoiceInputPartial?
                this.elevateMethods(
                    '_updateLastSelectedValue',
                    'onSelectableStateChange');

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

                /**
                 * @type {string}
                 */
                this.inputName = undefined;

                //this.setTagName('div');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.SelectableLookupMaintainer.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);

                this._syncItemsToSelection();

                this.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, this.onSelectableStateChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
            },

            /**
             * TODO: Part of it is shared w/ SingleSelect
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.RadioGroup}
             */
            addItemWidget: function (itemWidget) {
                base.addItemWidget.call(this, itemWidget);

                var binaryInput = itemWidget.getAllDescendants()
                    .filterByType($basicWidgets.BinaryInput)
                    .getFirstValue();

                $assertion.assert(binaryInput, "Item contains no input widget");

                $basicWidgets.SelectableLookupMaintainer.addItemWidget.call(this, binaryInput);

                // making sure input name matches siblings
                binaryInput.setName(this.inputName);

                if (binaryInput.selected) {
                    // TODO: Add test
                    this.selectedValue = binaryInput.getValue();
                    this._updateLastSelectedValueDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * TODO: Part of it is shared w/ SingleSelect
             * @param {$widget.Widget} itemWidget Supposed to contain one (and only one) BinaryInput.
             * @returns {$basicWidgets.RadioGroup}
             */
            removeItemWidget: function (itemWidget) {
                base.removeItemWidget.call(this, itemWidget);

                var binaryInput = itemWidget.getAllDescendants()
                    .filterByType($basicWidgets.BinaryInput)
                    .getFirstValue();

                $assertion.assert(binaryInput, "Item contains no input widget");

                $basicWidgets.SelectableLookupMaintainer.removeItemWidget.call(this, binaryInput);

                if (binaryInput.selected) {
                    // TODO: Add test
                    this.selectedValue = undefined;
                    this._updateLastSelectedValueDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * Sets input name.
             * TODO: Should come from an input-like interface (set(Input)Name, set(Input)Value)
             * @param {string} name
             * @returns {$basicWidgets.RadioGroup}
             */
            setName: function (name) {
                this.getAllDescendants()
                    .filterByType($basicWidgets.BinaryInput)
                    .callOnEachItem('setName', name);

                /** @type {string} */
                this.inputName = name;

                return this;
            },

            /**
             * Shorthand for adding a radio button with text to the group.
             * @param {string} childName
             * @param {string} radioValue
             * @param {string|$utils.Stringifiable} radioText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.RadioGroup}
             */
            addRadioButton: function (childName, radioValue, radioText, selected) {
                var labelWidget = $basicWidgets.Text.create()
                    .setContentString(radioText),
                    radioWidget = $basicWidgets.BinaryInput.create('radio')
                        .setChildName(childName)
                        .setValue(radioValue)
                        .linkLabelWidget(labelWidget);

                if (selected) {
                    radioWidget.select();
                }

                this.addItemWidget($widget.Widget.create()
                    .setChildName(childName)
                    .setTagName('li')
                    .addChild(radioWidget)
                    .addChild(labelWidget));

                return this;
            },

            /**
             * TODO: Large part of it is shared w/ SingleSelect
             * @param {string} value
             * @returns {$basicWidgets.RadioGroup}
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

            /**
             * TODO: Shared w/ SingleSelect
             * @returns {string}
             */
            getValue: function () {
                return this.selectedValue;
            },

            /**
             * TODO: Shared w/ SingleSelect
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                $basicWidgets.SelectableLookupMaintainer
                    .onSelectableValueChange.call(this, event);

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
             * TODO: Shared w/ SingleSelect
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
