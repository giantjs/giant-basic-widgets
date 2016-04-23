$oop.postpone($basicWidgets, 'DirectInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Input,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.DirectInput.create
     * @function
     * @param {string} [inputType]
     * @returns {$basicWidgets.DirectInput}
     */

    /**
     * Implements text-based inputs such as text, password, email, etc.
     * TODO: Handle TAB.
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
            _updateValue: function () {
                var element = this.getElement(),
                    newValue = this._getValueProxy(element),
                    oldValue = this.getValue();

                if (element && oldValue !== newValue) {
                    this.setValue(newValue);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DirectInput# */{
            /**
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
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
             * @param {*} value
             * @returns {$basicWidgets.Input}
             */
            setValue: function (value) {
                var oldValue = this.getValue();
                base.setValue.call(this, value);
                if (value !== oldValue) {
                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(oldValue)
                        .setAfterValue(value)
                        .triggerSync();
                }
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearValue: function () {
                var oldValue = this.getValue();
                base.clearValue.call(this);
                if (oldValue !== undefined) {
                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(oldValue)
                        .triggerSync();
                }
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onInput: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateValue();
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateValue();
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
