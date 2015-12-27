$oop.postpone($basicWidgets, 'DirectInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Input,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.DirectInput.create
     * @function
     * @param {string} [inputType='text']
     * @returns {$basicWidgets.DirectInput}
     */

    /**
     * @class
     * @extends $basicWidgets.Input
     */
    $basicWidgets.DirectInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DirectInput# */{
            /**
             * @param {HTMLInputElement} element
             * @returns {*}
             * @private
             */
            _getValueProxy: function (element) {
                return element.value;
            },

            /** @private */
            _updateInputValue: function () {
                var element = this.getElement(),
                    newValue = this._getValueProxy(element),
                    oldValue = this.getInputValue();

                if (element && oldValue !== newValue) {
                    this.setInputValue(newValue);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DirectInput# */{
            /**
             * @param {string} [inputType='text']
             * @ignore
             */
            init: function (inputType) {
                inputType = inputType || 'text';

                base.init.call(this, inputType);

                this.elevateMethods(
                    'onInput',
                    'onChange');
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /**
             * Sets input value.
             * @param {*} inputValue
             * @returns {$basicWidgets.Input}
             */
            setInputValue: function (inputValue) {
                var oldInputValue = this.getInputValue();
                base.setInputValue.call(this, inputValue);
                if (inputValue !== oldInputValue) {
                    this.triggerSync($basicWidgets.EVENT_INPUT_STATE_CHANGE);
                }
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearInputValue: function () {
                var oldInputValue = this.getInputValue();
                base.clearInputValue.call(this);
                if (oldInputValue !== undefined) {
                    this.triggerSync($basicWidgets.EVENT_INPUT_STATE_CHANGE);
                }
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onInput: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateInputValue();
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateInputValue();
                link.unlink();
            }
        });

    /**
     * @name $basicWidgets.DirectInput#_addEventListenerProxy
     * @function
     * @param {HTMLElement} element
     * @param {string} type
     * @param {function} callback
     * @private
     */
});
