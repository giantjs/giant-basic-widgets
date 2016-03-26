$oop.postpone($basicWidgets, 'ClickArea', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable);

    /**
     * Creates a ClickArea instance.
     * @name $basicWidgets.ClickArea.create
     * @function
     * @returns {$basicWidgets.ClickArea}
     */

    /**
     * Implements an area or container that can be clicked.
     * Typically used as a button.
     * Supports disabling and click events.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.ClickArea = self
        .addPrivateMethods(/** @lends $basicWidgets.ClickArea# */{
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
        .addMethods(/** @lends $basicWidgets.ClickArea# */{
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
             * Clicks the area. Call this method for controlling the widget externally.
             * @returns {$basicWidgets.ClickArea}
             */
            click: function () {
                if (!this.isDisabled()) {
                    this.triggerSync($basicWidgets.EVENT_CLICK_AREA_CLICK);
                }
                return this;
            },

            /**
             * @param {Event} event
             * @ignore */
            onClick: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.click();
                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that a ClickArea was clicked.
         * @constants
         */
        EVENT_CLICK_AREA_CLICK: 'widget.click-area.click'
    });
}());
