$oop.postpone($basicWidgets, 'Button', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Clickable, 'Clickable');

    /**
     * Creates a Button instance.
     * @name $basicWidgets.Button.create
     * @function
     * @returns {$basicWidgets.Button}
     */

    /**
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Clickable
     */
    $basicWidgets.Button = self
        .addPrivateMethods(/** @lends $basicWidgets.Button# */{
            /** @private */
            _updateEnabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Clickable.init.call(this);

                this.setTagName('button');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                this._updateEnabledAttribute();
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.Clickable.afterRender.call(this);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateEnabledAttribute();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateEnabledAttribute();
                }
            },

            /**
             * Overrides Clickable's click to take disabled state into account.
             * @returns {$basicWidgets.Button}
             */
            click: function () {
                if (!this.isDisabled()) {
                    $basicWidgets.Clickable.click.call(this);
                }
                return this;
            }
        });
});
