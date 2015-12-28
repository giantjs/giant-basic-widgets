$oop.postpone($basicWidgets, 'Input', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable);

    /**
     * Creates an Input instance.
     * @name $basicWidgets.Input.create
     * @function
     * @param {string} inputType Type attribute of the input element.
     * @returns {$basicWidgets.Input}
     */

    /**
     * TODO: Add before / after values to change events. (Possibly via specific event classes.)
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.Input = self
        .addPrivateMethods(/** @lends $basicWidgets.Input# */{
            /**
             * @param {HTMLInputElement} element
             * @param {*} value
             * @private
             */
            _setValueProxy: function (element, value) {
                element.value = value;
            },

            /**
             * @param {HTMLElement} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            },

            /**
             * @returns {DocumentView}
             * @private
             */
            _activeElementGetterProxy: function () {
                return document.activeElement;
            },

            /**
             * @param {HTMLInputElement} element
             * @private
             */
            _focusProxy: function (element) {
                return element.focus();
            },

            /**
             * @param {HTMLInputElement} element
             * @private
             */
            _blurProxy: function (element) {
                return element.blur();
            },

            /** @private */
            _updateInputEnabledState: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Input# */{
            /**
             * TODO: Stricter checks for input type?
             * @param {string} inputType
             * @ignore
             */
            init: function (inputType) {
                $assertion.isString(inputType, "Invalid input type");

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.setTagName('input');

                this.elevateMethods(
                    'onFocusIn',
                    'onFocusOut');

                this.addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
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
                this._addEventListenerProxy(element, 'focusin', this.onFocusIn);
                this._addEventListenerProxy(element, 'focusout', this.onFocusOut);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateInputEnabledState();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateInputEnabledState();
                }
            },

            /**
             * @param {string} attributeName
             * @param {*} attributeValue
             * @returns {$basicWidgets.Input}
             */
            addAttribute: function (attributeName, attributeValue) {
                base.addAttribute.call(this, attributeName, attributeValue);
                var element = this.getElement();
                if (element && attributeName === 'value') {
                    this._setValueProxy(element, attributeValue);
                }
                return this;
            },

            /**
             * @param {string} attributeName
             * @returns {$basicWidgets.Input}
             */
            removeAttribute: function (attributeName) {
                base.removeAttribute.call(this, attributeName);
                var element = this.getElement();
                if (element && attributeName === 'value') {
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
             * @returns {string}
             */
            getInputType: function () {
                return this.htmlAttributes.getItem('type');
            },

            /**
             * Sets input value.
             * @param {*} inputValue
             * @returns {$basicWidgets.Input}
             */
            setInputValue: function (inputValue) {
                this.addAttribute('value', inputValue);
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearInputValue: function () {
                this.removeAttribute('value');
                return this;
            },

            /**
             * Retrieves value associated with input.
             * @returns {*}
             */
            getInputValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * @param {string} inputName
             * @returns {$basicWidgets.Input}
             */
            setInputName: function (inputName) {
                this.addAttribute('name', inputName);
                return this;
            },

            /**
             * @returns {string}
             */
            getInputName: function () {
                return this.htmlAttributes.getItem('name');
            },

            /**
             * Focuses on the current input.
             * @returns {$basicWidgets.Input}
             */
            focusOnInput: function () {
                var element = this.getElement();
                if (element) {
                    this._focusProxy(element);
                }
                return this;
            },

            /**
             * Removes focus from the current input.
             * @returns {$basicWidgets.Input}
             */
            blurInput: function () {
                var element = this.getElement();
                if (element) {
                    this._blurProxy(element);
                }
                return this;
            },

            /**
             * Tells whether current input has the focus.
             * @returns {boolean}
             */
            isFocused: function () {
                var element = this.getElement();
                return element && element === this._activeElementGetterProxy();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onFocusIn: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($basicWidgets.EVENT_INPUT_FOCUS);
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onFocusOut: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($basicWidgets.EVENT_INPUT_BLUR);
                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /** @constant */
        EVENT_INPUT_STATE_CHANGE: 'widget.change.input.state',

        /** @constant */
        EVENT_INPUT_FOCUS: 'widget.focus.input',

        /** @constant */
        EVENT_INPUT_BLUR: 'widget.blur.input'
    });
}());
