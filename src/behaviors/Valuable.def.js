$oop.postpone($basicWidgets, 'Valuable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * For widgets that may have a value assigned to them.
     * Expects to be added to Widget hosts, the DOM element of which support value property.
     * TODO: Rename to DomValuable?
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $basicWidgets.Valuable = self
        .addPrivateMethods(/** @lends $basicWidgets.Valuable# */{
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
            },

            /** @private */
            _updateDomValue: function () {
                var element = this.getElement(),
                    oldValue,
                    newValue = $utils.Stringifier.stringify(this.value);

                if (element) {
                    oldValue = this._getValueProxy(element);
                    if (newValue !== oldValue) {
                        this._setValueProxy(element, newValue);
                    }
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Valuable# */{
            /** Call from host's .init() */
            init: function () {
                /**
                 * Value associated with the Valuable.
                 * @type {string}
                 */
                this.value = undefined;
            },

            /** Call from host's .afterRender() */
            afterRender: function () {
                this._updateDomValue();
            },

            /**
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.Valuable}
             */
            setValue: function (value) {
                if (this.value !== value) {
                    this.value = value;
                    this._updateDomValue();
                }
                return this;
            },

            /**
             * Clears input value and triggers events.
             * @returns {$basicWidgets.Valuable}
             */
            clearValue: function () {
                if (this.value) {
                    this.value = undefined;
                    this._updateDomValue();
                }
                return this;
            }
        });
});
