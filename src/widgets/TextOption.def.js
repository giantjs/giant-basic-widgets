$oop.postpone($basicWidgets, 'TextOption', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTrait($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Optionable);

    /**
     * Creates a TextOption instance.
     * @name $basicWidgets.TextOption.create
     * @function
     * @returns {$basicWidgets.TextOption}
     */

    /**
     * A select option with static text inside.
     * @class
     * @extends $basicWidgets.Text
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Optionable
     */
    $basicWidgets.TextOption = self
        .addMethods(/** @lends $basicWidgets.TextOption# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Optionable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.Optionable.afterRender.call(this);
            },

            /** @ignore */
            afterStateOn: function () {
                $basicWidgets.Disableable.afterStateOn.call(this);
                $basicWidgets.Optionable.afterStateOn.call(this);
            },

            /** @ignore */
            afterStateOff: function () {
                $basicWidgets.Disableable.afterStateOff.call(this);
                $basicWidgets.Optionable.afterStateOff.call(this);
            }
        });
});
