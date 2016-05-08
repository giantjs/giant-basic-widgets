$oop.postpone($basicWidgets, 'BinaryInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Inputable, 'Inputable')
            .addTraitAndExtend($basicWidgets.Focusable, 'Focusable');

    /**
     * @name $basicWidgets.BinaryInput.create
     * @function
     * @param {string} [inputType='checkbox']
     * @returns {$basicWidgets.BinaryInput}
     */

    /**
     * Implements checkbox or radio button.
     * TODO: What about mixed state? Use undefined?
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Focusable
     * @extends $basicWidgets.Inputable
     * @implements $basicWidgets.Selectable
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
                    if (checked) {
                        this.select();
                    } else {
                        this.deselect();
                    }
                }
            },

            /** @private */
            _updateDomChecked: function () {
                var element = this.getElement(),
                    checked;

                if (element) {
                    checked = this._getCheckedProxy(element);
                    if (this.selected !== checked) {
                        this._setCheckedProxy(element, this.selected);
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
                this.selected = undefined;

                this.setTagName('input');
                this.addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.Inputable.afterAdd.call(this);
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

                this._updateDomChecked();

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Inputable.afterStateOn.call(this, stateName);
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Inputable.afterStateOff.call(this, stateName);
            },

            /**
             * @param {boolean|undefined} selected
             * @returns {$basicWidgets.BinaryInput}
             */
            setValue: function (selected) {
                var wasChecked = this.selected,
                    baseValue = this.getBaseValue();

                if (wasChecked !== selected) {
                    this.selected = selected;

                    this._updateDomChecked();

                    if (baseValue !== undefined) {
                        this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                            .setBeforeValue(wasChecked ? baseValue : undefined)
                            .setAfterValue(selected ? baseValue : undefined)
                            .triggerSync();
                    }
                }

                return this;
            },

            /**
             * Sets base value for the input.
             * Base value used as the input's value when it's checked.
             * @param {string} value
             * @returns {$basicWidgets.BinaryInput}
             */
            setBaseValue: function (value) {
                var isChecked = this.selected,
                    oldValue = this.getBaseValue();

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
             * Retrieves value HTML attribute.
             * @returns {string}
             */
            getBaseValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * Selects input and triggers appropriate events.
             * @returns {$basicWidgets.BinaryInput}
             */
            select: function () {
                this.setValue(true);
                return this;
            },

            /**
             * Deselects input and triggers appropriate events.
             * @returns {$basicWidgets.BinaryInput}
             */
            deselect: function () {
                this.setValue(false);
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
