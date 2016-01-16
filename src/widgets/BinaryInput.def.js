$oop.postpone($basicWidgets, 'BinaryInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Input,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.BinaryInput.create
     * @function
     * @param {string} [inputType='checkbox']
     * @returns {$basicWidgets.BinaryInput}
     */

    /**
     * Implements checkbox or radio button.
     * TODO: Add surrogate?
     * @class
     * @extends $basicWidgets.Input
     */
    $basicWidgets.BinaryInput = self
        .addPrivateMethods(/** @lends $basicWidgets.BinaryInput# */{
            /**
             * @param {HTMLInputElement} element
             * @param {*} value
             * @private
             */
            _setCheckedProxy: function (element, value) {
                element.checked = value;
            },

            /**
             * @param {HTMLInputElement} element
             * @returns {*}
             * @private
             */
            _getCheckedProxy: function (element) {
                return element.checked;
            },

            /** @private */
            _updateChecked: function () {
                var element = this.getElement(),
                    newChecked = this._getCheckedProxy(element),
                    oldChecked = this.getChecked();

                if (element && oldChecked !== newChecked) {
                    this.setChecked(newChecked);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.BinaryInput# */{
            /**
             * @param {string} [inputType='checkbox']
             * @ignore
             */
            init: function (inputType) {
                inputType = inputType || 'checkbox';

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
             * @param {string} attributeName
             * @param {*} attributeValue
             * @returns {$basicWidgets.Input}
             */
            addAttribute: function (attributeName, attributeValue) {
                base.addAttribute.call(this, attributeName, attributeValue);
                var element = this.getElement();
                if (element && attributeName === 'checked') {
                    this._setCheckedProxy(element, attributeValue);
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
                if (element && attributeName === 'checked') {
                    this._setCheckedProxy(element, false);
                }
                return this;
            },

            /**
             * Sets input value.
             * @param {*} checked
             * @returns {$basicWidgets.Input}
             */
            setChecked: function (checked) {
                var oldChecked = this.getChecked(),
                    inputValue = this.getInputValue();
                if (checked !== oldChecked) {
                    this.addAttribute('checked', checked);
                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(oldChecked ? inputValue : undefined)
                        .setAfterValue(checked ? inputValue : undefined)
                        .triggerSync();
                }
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearChecked: function () {
                var oldChecked = this.getChecked();
                if (oldChecked !== undefined) {
                    this.removeAttribute('checked');
                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(this.getInputValue())
                        .triggerSync();
                }
                return this;
            },

            /**
             * Retrieves value associated with input.
             * @returns {*}
             */
            getChecked: function () {
                return this.htmlAttributes.getItem('checked');
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onInput: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateChecked();
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateChecked();
                link.unlink();
            }
        });

    /**
     * @name $basicWidgets.BinaryInput#_addEventListenerProxy
     * @function
     * @param {HTMLElement} element
     * @param {string} type
     * @param {function} callback
     * @private
     */
});
