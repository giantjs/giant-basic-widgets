$oop.postpone($basicWidgets, 'Input', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Controllable, 'Controllable')
            .addTraitAndExtend($basicWidgets.Focusable, 'Focusable')
            .addTraitAndExtend($basicWidgets.Valuable, 'Valuable');

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
     * @extends $basicWidgets.Valuable
     */
    $basicWidgets.Input = self
        .addMethods(/** @lends $basicWidgets.Input# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Focusable.init.call(this);
                $basicWidgets.Valuable.init.call(this);
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
                $basicWidgets.Valuable.afterRender.call(this);
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
