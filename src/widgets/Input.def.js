$oop.postpone($basicWidgets, 'Input', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Controllable, 'Controllable');

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
     */
    $basicWidgets.Input = self
        .addPrivateMethods(/** @lends $basicWidgets.Input# */{
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
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                $assertion.isStringOptional(inputType, "Invalid input type");

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.setTagName('input');

                this.elevateMethods(
                    'onFocusIn',
                    'onFocusOut');

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

                var element = this.getElement();
                this._addEventListenerProxy(element, 'focusin', this.onFocusIn);
                this._addEventListenerProxy(element, 'focusout', this.onFocusOut);
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
             * @param {string} attributeName
             * @param {*} attributeValue
             * @returns {$basicWidgets.Input}
             */
            addAttribute: function (attributeName, attributeValue) {
                base.addAttribute.call(this, attributeName, attributeValue);
                $basicWidgets.Controllable.addAttribute.call(this, attributeName, attributeValue);
                return this;
            },

            /**
             * @param {string} attributeName
             * @returns {$basicWidgets.Input}
             */
            removeAttribute: function (attributeName) {
                base.removeAttribute.call(this, attributeName);
                $basicWidgets.Controllable.removeAttribute.call(this, attributeName);
                return this;
            },

            /**
             * @returns {string}
             */
            getType: function () {
                return this.htmlAttributes.getItem('type');
            },

            /**
             * Focuses on the current input.
             * @returns {$basicWidgets.Input}
             */
            focus: function () {
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
            blur: function () {
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
