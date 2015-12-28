$oop.postpone($basicWidgets, 'Input', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * Creates an Input instance.
     * @name $basicWidgets.Input.create
     * @function
     * @param {string} inputType Type attribute of the input element.
     * @returns {$basicWidgets.Input}
     */

    /**
     * TODO: Add before / after values to change events. (Possibly via specific event classes.)
     * TODO: Add name attribute getter / setter.
     * TODO: Add interface to associate label.
     * TODO: Add disabling.
     * @class
     * @extends $widget.Widget
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
                this.setTagName('input');

                this.elevateMethods(
                    'onFocusIn',
                    'onFocusOut');

                this.addAttribute('type', inputType);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'focusin', this.onFocusIn);
                this._addEventListenerProxy(element, 'focusout', this.onFocusOut);
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
