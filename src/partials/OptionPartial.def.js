$oop.postpone($basicWidgets, 'OptionPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Partial class to build widgets that implement the <option> element.
     * Expects the host to be a Widget that has the Disableable trait.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @implements $basicWidgets.Selectable
     */
    $basicWidgets.OptionPartial = self
        .addPrivateMethods(/** @lends $basicWidgets.OptionPartial# */{
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
                return parent && parent.tagName === 'select';
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
        .addMethods(/** @lends $basicWidgets.OptionPartial# */{
            /** Call from host's .init() */
            init: function () {
                this.setTagName('option');

                /**
                 * Whether the option is currently selected.
                 * @type {boolean}
                 */
                this.selected = false;
            },

            /** Call from host's .afterRender() */
            afterRender: function () {
                // syncing selected state to 'selected' attribute
                if (this._getSelectedProxy(this.getElement())) {
                    this.select();
                }
            },

            /** Call from host's .afterStateOn() */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /** Call from host's .afterStateOff() */
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
             * @returns {$basicWidgets.OptionPartial}
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
             * @returns {$basicWidgets.OptionPartial}
             */
            select: function () {
                $assertion.assert(this._isAddedToSelect(), "Orphan options are not selectable");

                var element = this.getElement();

                if (!this.selected) {
                    this.selected = true;

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
             * @returns {$basicWidgets.OptionPartial}
             */
            deselect: function () {
                $assertion.assert(this._isAddedToSelect(), "Orphan options are not selectable");

                var element = this.getElement();

                if (this.selected) {
                    this.selected = false;

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
