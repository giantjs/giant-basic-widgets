$oop.postpone($basicWidgets, 'DirectInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
        // TODO: See where we could ditch ...AndExtend()
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Inputable, 'Inputable')
            .addTraitAndExtend($basicWidgets.Focusable, 'Focusable')
            .addTraitAndExtend($basicWidgets.Valuable, 'Valuable');

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
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Focusable
     * @extends $basicWidgets.Valuable
     */
    $basicWidgets.DirectInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DirectInput# */{
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
            }
        })
        .addMethods(/** @lends $basicWidgets.DirectInput# */{
            /**
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Focusable.init.call(this);
                $basicWidgets.Valuable.init.call(this);

                this.elevateMethods(
                    'onInput',
                    'onChange');

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
                $basicWidgets.Valuable.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Inputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Inputable.afterStateOff.call(this, stateName);
            },

            /**
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.DirectInput}
             */
            setValue: function (value) {
                var oldValue = this.value;
                $basicWidgets.Valuable.setValue.call(this, value);
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
             * @returns {$basicWidgets.DirectInput}
             */
            clearValue: function () {
                var oldValue = this.value;
                $basicWidgets.Valuable.clearValue.call(this);
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
     * @name $basicWidgets.DirectInput#_getValueProxy
     * @function
     * @param {HTMLElement} element
     * @returns {string}
     * @private
     */

    /**
     * @name $basicWidgets.DirectInput#_addEventListenerProxy
     * @function
     * @param {HTMLElement} element
     * @param {string} type
     * @param {function} callback
     * @private
     */
});
