$oop.postpone($basicWidgets, 'Option', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable');

    /**
     * Creates a Option instance.
     * @name $basicWidgets.Option.create
     * @function
     * @returns {$basicWidgets.Option}
     */

    /**
     * Represents a single option among multiple choices, based on the <option> element.
     * @class
     * @extends $basicWidgets.Text
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.Option = self
        .addPrivateMethods(/** @lends $basicWidgets.Option# */{
            /** @private */
            _updateDisabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            },

            /**
             * @returns {boolean}
             * @private
             */
            _isAddedToSelect: function () {
                var parent = this.parent;
                return parent && parent.isA($basicWidgets.Select);
            },

            /**
             * TODO: Move to DOM proxy class.
             * @param {HTMLOptionElement} element
             * @private
             */
            _getSelectedProxy: function (element) {
                return element.selected;
            },

            /**
             * TODO: Move to DOM proxy class.
             * @param {HTMLOptionElement} element
             * @param {boolean} selected
             * @private
             */
            _setSelectedProxy: function (element, selected) {
                element.selected = selected;
            }
        })
        .addMethods(/** @lends $basicWidgets.Option# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.setTagName('option');

                /**
                 * Whether the option is currently selected.
                 * @type {boolean}
                 */
                this.isSelected = false;
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                // syncing selected state to 'selected' attribute
                if (this._getSelectedProxy(this.getElement())) {
                    this.selectOption();
                }
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Retrieves value currently associated with the option.
             * @returns {string}
             */
            getOptionValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * Associates value with option.
             * @param {string} optionValue
             * @returns {$basicWidgets.Option}
             */
            setOptionValue: function (optionValue) {
                var beforeValue = this.getOptionValue();

                if (optionValue !== beforeValue) {
                    this.addAttribute('value', optionValue);

                    // triggering event about value change (on parent, non-bubbling)
                    // TODO: Special option value change event?
                    this.spawnEvent($basicWidgets.EVENT_OPTION_VALUE_CHANGE)
                        .setPayloadItems({
                            beforeValue: beforeValue,
                            afterValue : optionValue
                        })
                        .triggerSync();
                }

                return this;
            },

            /**
             * Selects the current option if it's added to a select.
             * @returns {$basicWidgets.Option}
             */
            selectOption: function () {
                $assertion.assert(this._isAddedToSelect(), "Orphan options are not selectable");

                var element = this.getElement();

                if (!this.isSelected) {
                    this.isSelected = true;

                    if (element) {
                        this._setSelectedProxy(element, true);
                    }

                    this.spawnEvent($basicWidgets.EVENT_OPTION_SELECTED_CHANGE)
                        .setPayloadItems({
                            wasSelected: false,
                            isSelected: true
                        })
                        .triggerSync();
                }

                return this;
            },

            /**
             * Selects the current option if it's added to a select.
             * @returns {$basicWidgets.Option}
             */
            deselectOption: function () {
                $assertion.assert(this._isAddedToSelect(), "Orphan options are not selectable");

                var element = this.getElement();

                if (this.isSelected) {
                    this.isSelected = false;

                    if (element) {
                        this._setSelectedProxy(element, false);
                    }

                    this.spawnEvent($basicWidgets.EVENT_OPTION_SELECTED_CHANGE)
                        .setPayloadItems({
                            wasSelected: true,
                            isSelected: false
                        })
                        .triggerSync();
                }

                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that the value of an option has changed.
         * @constants
         */
        EVENT_OPTION_VALUE_CHANGE: 'widget.change.option.value',

        /**
         * Signals that the selected state of an option has changed.
         * @constants
         */
        EVENT_OPTION_SELECTED_CHANGE: 'widget.change.option.selected'
    });
}());
