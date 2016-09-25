$oop.postpone($basicWidgets, 'TextInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            // TODO: See where we could ditch ...AndExtend()
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable')
            .addTraitAndExtend($basicWidgets.DomFocusable, 'DomFocusable')
            .addTraitAndExtend($basicWidgets.DomValuable, 'DomValuable');

    /**
     * @name $basicWidgets.TextInput.create
     * @function
     * @param {string} [inputType]
     * @returns {$basicWidgets.TextInput}
     */

    /**
     * Simple text-based input field, such as text, password, email, etc.
     * TODO: Handle TAB.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomFocusable
     * @extends $basicWidgets.DomValuable
     */
    $basicWidgets.TextInput = self
        .addPrivateMethods(/** @lends $basicWidgets.TextInput# */{
            /**
             * Updates value property based on current DOM value.
             * @private
             */
            _updateValue: function () {
                var element = this.getElement(),
                    newValue = this._getValueProxy(element),
                    oldValue = this.value;

                if (element && oldValue !== newValue) {
                    this.setValue(newValue);
                }
            },

            /**
             * @private
             */
            _updateValidity: function () {
                var wasValid = this.isValid,
                    isValid = this.getValidity();

                if (isValid !== wasValid) {
                    this.isValid = isValid;

                    // TODO: in event handler
                    this._syncCssToValidity();

                    // TODO: Add an event class and spawn.
                    this.triggerSync($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE);
                }
            },

            /**
             * @private
             */
            _syncCssToValidity: function () {
                if (this.isValid) {
                    this.addCssClass('input-valid')
                        .removeCssClass('input-invalid');
                } else {
                    this.addCssClass('input-invalid')
                        .removeCssClass('input-valid');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.TextInput# */{
            /**
             * TODO: Check inputType
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.DomFocusable.init.call(this);
                $basicWidgets.DomValuable.init.call(this);

                this.elevateMethods(
                    'onInput',
                    'onChange');

                /**
                 * Validator, run after value changes.
                 * @type {function}
                 */
                this.validator = undefined;

                /**
                 * @type {boolean}
                 */
                this.isValid = true;

                this.setTagName('input');
                this.addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.DomFocusable.afterRender.call(this);
                $basicWidgets.DomValuable.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.TextInput}
             */
            setValue: function (value) {
                $basicWidgets.DomValuable.setValue.call(this, value);
                this._updateValidity();
                return this;
            },

            /**
             * TODO: Move to 'Validatable'?
             * @param {function} validator
             * @returns {$basicWidgets.TextInput}
             */
            setValidator: function (validator) {
                $assertion.isFunctionOptional(validator);
                this.validator = validator;
                this._updateValidity();
                return this;
            },

            /**
             * Determinnes whether the current validatable instance is valid.
             * When there is no validator specified, default is valid.
             * @returns {boolean}
             */
            getValidity: function () {
                var validator = this.validator;
                return !validator || validator(this.value);
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
     * @name $basicWidgets.TextInput#_getValueProxy
     * @function
     * @param {HTMLElement} element
     * @returns {string}
     * @private
     */

    /**
     * @name $basicWidgets.TextInput#_addEventListenerProxy
     * @function
     * @param {HTMLElement} element
     * @param {string} type
     * @param {function} callback
     * @private
     */
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /** @constant */
    EVENT_INPUT_VALIDITY_CHANGE: 'widget.change.input.validity'
});
