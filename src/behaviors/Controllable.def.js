$oop.postpone($basicWidgets, 'Controllable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTraitAndExtend($basicWidgets.Disableable);

    /**
     * Assignable to any input-like widget, such as input, select, button, etc.
     * Controllable widgets have a name, value, disabled HTML attribute, and may be associated with labels.
     * Expects to be added to widgets bearing the Disableable trait.
     * TODO: Think of a more descriptive name.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Widget
     */
    $basicWidgets.Controllable = self
        .addPrivateMethods(/** @lends $basicWidgets.Controllable# */{
            /**
             * @param {HTMLInputElement} element
             * @returns {string}
             * @private
             */
            _getValueProxy: function (element) {
                return element.value;
            },

            /**
             * @param {HTMLInputElement} element
             * @param {*} value
             * @private
             */
            _setValueProxy: function (element, value) {
                element.value = value;
            },

            /** @private */
            _updateDisabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            },

            /** @private */
            _updateDisabledState: function () {
                var name = this.getName();

                if (name) {
                    this.enableBy('input-name-availability');
                } else {
                    this.disableBy('input-name-availability');
                }
            },

            /** @private */
            _getValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * @param {*} value
             * @private
             */
            _setValue: function (value) {
                this.addAttribute('value', value);
            },

            /** @private */
            _clearValue: function () {
                this.removeAttribute('value');
            }
        })
        .addMethods(/** @lends $basicWidgets.Controllable# */{
            /**
             * Call from host's afterAdd
             */
            afterAdd: function () {
                this._updateDisabledState();
            },

            /**
             * Call from host's .afterStateOn
             */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Call from host's .afterStateOff
             */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Call from host's .addAttribute
             * @param {string} attributeName
             * @param {*} attributeValue
             * @returns {$basicWidgets.Input}
             */
            addAttribute: function (attributeName, attributeValue) {
                var element = this.getElement();
                if (element && attributeName === 'value' &&
                    attributeValue !== this._getValueProxy(element)
                ) {
                    this._setValueProxy(element, attributeValue);
                }
                return this;
            },

            /**
             * Call from host's .removeAttribute
             * @param {string} attributeName
             * @returns {$basicWidgets.Input}
             */
            removeAttribute: function (attributeName) {
                var element = this.getElement();
                if (element && attributeName === 'value' &&
                    this._getValueProxy(element)
                ) {
                    this._setValueProxy(element, '');
                }
                return this;
            },

            /**
             * @param {$basicWidgets.Text} labelWidget
             * @returns {$basicWidgets.Input}
             */
            linkLabelWidget: function (labelWidget) {
                $assertion.assert($basicWidgets.Text.isBaseOf(labelWidget),
                    "Invalid label widget");

                labelWidget
                    .setTagName('label')
                    .addAttribute('for', this.htmlAttributes.idAttribute);

                return this;
            },

            /**
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.Input}
             */
            setValue: function (value) {
                this._setValue(value);
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearValue: function () {
                this._clearValue();
                return this;
            },

            /**
             * Retrieves value associated with input.
             * @returns {*}
             */
            getValue: function () {
                return this._getValue();
            },

            /**
             * @param {string} name
             * @returns {$basicWidgets.Input}
             */
            setName: function (name) {
                this.addAttribute('name', name);
                this._updateDisabledState();
                return this;
            },

            /**
             * Clears input name attribute.
             * @returns {$basicWidgets.Input}
             */
            clearName: function () {
                this.removeAttribute('name');
                this._updateDisabledState();
                return this;
            },

            /**
             * @returns {string}
             */
            getName: function () {
                return this.htmlAttributes.getItem('name');
            }
        });
});
