$oop.postpone($basicWidgets, 'BinaryInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Controllable, 'Controllable')
            .addTraitAndExtend($basicWidgets.Focusable, 'Focusable');

    /**
     * @name $basicWidgets.BinaryInput.create
     * @function
     * @param {string} [inputType='checkbox']
     * @returns {$basicWidgets.BinaryInput}
     */

    /**
     * Implements checkbox or radio button.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Focusable
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
                    checked;

                if (element) {
                    checked = this._getCheckedProxy(element);
                    if (this.checked !== checked) {
                        this.setChecked(checked);
                    }
                }
            },

            /** @private */
            _updateDomChecked: function () {
                var element = this.getElement(),
                    checked = this.checked;

                if (element) {
                    checked = this._getCheckedProxy(element);
                    if (this.checked !== checked) {
                        this._setCheckedProxy(element, checked);
                    }
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.BinaryInput# */{
            /**
             * TODO: Either checkbox or radio.
             * @param {string} [inputType='checkbox']
             * @ignore
             */
            init: function (inputType) {
                inputType = inputType || 'checkbox';

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Focusable.init.call(this);

                this.elevateMethods(
                    'onInput',
                    'onChange');

                /**
                 * Whether the input is checked.
                 * @type {boolean}
                 */
                this.checked = undefined;

                this.setTagName('input');
                this.addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.Controllable.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.Focusable.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Controllable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Controllable.afterStateOff.call(this, stateName);
            },

            /**
             * Sets value for the input.
             * TODO: Explain how values are different for radios / checkboxes and text inputs.
             * @param {string} value
             * @returns {$basicWidgets.BinaryInput}
             */
            setValue: function (value) {
                var isChecked = this.checked,
                    oldValue = this.getValue();

                if (value !== oldValue) {
                    this.addAttribute('value', value);

                    if (isChecked) {
                        this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                            .setBeforeValue(oldValue)
                            .setAfterValue(value)
                            .triggerSync();
                    }
                }

                return this;
            },

            /**
             * Clears input value.
             * @returns {$basicWidgets.BinaryInput}
             */
            clearValue: function () {
                var oldValue = this.getValue();

                if (oldValue) {
                    this.removeAttribute('value');

                    if (this.checked) {
                        this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                            .setBeforeValue(oldValue)
                            .triggerSync();
                    }
                }

                return this;
            },

            /**
             * Retrieves value HTML attribute.
             * @returns {string}
             */
            getValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * Sets input value.
             * TODO: Refactor into check / uncheck;
             * @param {*} checked
             * @returns {$basicWidgets.BinaryInput}
             */
            setChecked: function (checked) {
                var wasChecked = this.checked,
                    value = this.getValue();

                if (checked !== wasChecked) {
                    this.checked = checked;

                    this._updateDomChecked();

                    if (value !== undefined) {
                        this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                            .setBeforeValue(wasChecked ? value : undefined)
                            .setAfterValue(checked ? value : undefined)
                            .triggerSync();
                    }
                }

                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.BinaryInput}
             */
            clearChecked: function () {
                var wasChecked = this.checked,
                    value = this.getValue();

                if (wasChecked !== undefined) {
                    this.checked = undefined;

                    this._updateDomChecked();

                    if (value !== undefined) {
                        this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                            .setBeforeValue(value)
                            .triggerSync();
                    }
                }

                return this;
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
