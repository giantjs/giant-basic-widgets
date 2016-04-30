$oop.postpone($basicWidgets, 'Controllable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTraitAndExtend($basicWidgets.Disableable);

    /**
     * Assignable to common inputs, such as text, select, button, etc.
     * Input widgets share the following properties:
     * - have a name
     * - have a value (state)
     * - can be disabled
     * - can be associated with labels
     * - trigger events when properties change (name & value)
     * Expects to be added to widgets bearing the Disableable trait.
     * Remark: Common inputs just _happen_ to share name and disabled properties / attributes,
     * they're not implementing a common interface within the DOM.
     * Unfortunately the same doesn't apply to the value property / attribute,
     * hence the corresponding virtual methods.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Widget
     */
    $basicWidgets.Controllable = self
        .addPrivateMethods(/** @lends $basicWidgets.Controllable# */{
            /**
             * TODO: Perhaps control the DOM property rather than HTML attribute.
             * @private
             */
            _updateDisabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            },

            /** @private */
            _updateDisabledState: function () {
                var name = this.getName();

                if (name) {
                    this.enableBy('input-name-availability');
                } else {
                    this.disableBy('input-name-availability');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Controllable# */{
            /**
             * Call from host's afterAdd
             */
            afterAdd: function () {
                this._updateDisabledState();
            },

            /**
             * Call from host's .afterStateOn
             */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Call from host's .afterStateOff
             */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * @param {$basicWidgets.Text} labelWidget
             * @returns {$basicWidgets.Controllable}
             */
            linkLabelWidget: function (labelWidget) {
                $assertion.assert($basicWidgets.Text.isBaseOf(labelWidget),
                    "Invalid label widget");

                labelWidget
                    .setTagName('label')
                    .addAttribute('for', this.htmlAttributes.idAttribute);

                return this;
            },

            /**
             * @param {string} name
             * @returns {$basicWidgets.Controllable}
             */
            setName: function (name) {
                this.addAttribute('name', name);
                this._updateDisabledState();
                return this;
            },

            /**
             * Clears input name attribute.
             * @returns {$basicWidgets.Controllable}
             */
            clearName: function () {
                this.removeAttribute('name');
                this._updateDisabledState();
                return this;
            },

            /**
             * @returns {string}
             */
            getName: function () {
                return this.htmlAttributes.getItem('name');
            }
        });

    /**
     * @name $basicWidgets.Controllable#setValue
     * @function
     * @param {string} value
     * @returns {$basicWidgets.Controllable}
     */

    /**
     * @name $basicWidgets.Controllable#clearValue
     * @function
     * @returns {$basicWidgets.Controllable}
     */

    /**
     * @name $basicWidgets.Controllable#getValue
     * @function
     * @returns {string}
     */
});

(function () {
    "use strict";

    // TODO: Move to an appropriate trait / interface. (Eg. "Inputable")
    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /** @constant */
        EVENT_INPUT_STATE_CHANGE: 'widget.change.input.state'
    });
}());
