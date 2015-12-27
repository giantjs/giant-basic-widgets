$oop.postpone($basicWidgets, 'Button', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable);

    /**
     * Creates a Button instance.
     * @name $basicWidgets.Button.create
     * @function
     * @returns {$basicWidgets.Button}
     */

    /**
     * General purpose button widget.
     * Supports disabling and click events.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.Button = self
        .addPrivateMethods(/** @lends $basicWidgets.Button# */{
            /**
             * @param {Element} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            }
        })
        .addMethods(/** @lends $basicWidgets.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethod('onClick');
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
                this._addEventListenerProxy(this.getElement(), 'click', this.onClick);
            },

            /**
             * Clicks the button. Call this method for controlling the button externally.
             * @returns {$basicWidgets.Button}
             */
            clickButton: function () {
                if (!this.isDisabled()) {
                    this.triggerSync($basicWidgets.EVENT_BUTTON_CLICK);
                }
                return this;
            },

            /**
             * @param {Event} event
             * @ignore */
            onClick: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.clickButton();
                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that a Button was clicked.
         * @constants
         */
        EVENT_BUTTON_CLICK: 'widget.click.button'
    });
}());
