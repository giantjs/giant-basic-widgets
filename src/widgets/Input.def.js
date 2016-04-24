$oop.postpone($basicWidgets, 'Input', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Controllable, 'Controllable')
            .addTraitAndExtend($basicWidgets.Focusable, 'Focusable');

    /**
     * Creates an Input instance.
     * @name $basicWidgets.Input.create
     * @function
     * @param {string} inputType Type attribute of the input element.
     * @returns {$basicWidgets.Input}
     */

    /**
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Focusable
     */
    $basicWidgets.Input = self
        .addPrivateMethods(/** @lends $basicWidgets.Input# */{
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
            }
        })
        .addMethods(/** @lends $basicWidgets.Input# */{
            /**
             * TODO: Stricter checks for input type?
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                $assertion.isStringOptional(inputType, "Invalid input type");

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Focusable.init.call(this);

                this.setTagName('input');

                if (inputType) {
                    this.addAttribute('type', inputType);
                }
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
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.Input}
             */
            setValue: function (value) {
                var element = this.getElement(),
                    markupValue = this.htmlAttributes.getItem('value'),
                    domValue;

                // updating value attribute in markup
                if (markupValue !== value) {
                    this.addAttribute('value', value);
                }

                // updating value property in DOM
                if (element) {
                    domValue = this._getValueProxy(element);
                    if (domValue !== value) {
                        this._setValueProxy(element, value);
                    }
                }

                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Input}
             */
            clearValue: function () {
                var element = this.getElement(),
                    markupValue = this.htmlAttributes.getItem('value'),
                    domValue;

                // updating value attribute in markup
                if (markupValue) {
                    this.removeAttribute('value');
                }

                // updating value property in DOM
                if (element) {
                    domValue = this._getValueProxy(element);
                    if (domValue) {
                        this._setValueProxy(element, undefined);
                    }
                }

                return this;
            },

            /**
             * Retrieves value associated with input.
             * @returns {*}
             */
            getValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * @returns {string}
             */
            getType: function () {
                return this.htmlAttributes.getItem('type');
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
