$oop.postpone($basicWidgets, 'InputStateChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.InputStateChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.InputStateChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.InputStateChangeEvent = self
        .addMethods(/** @lends $basicWidgets.InputStateChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {*}
                 */
                this.beforeValue = undefined;

                /**
                 * @type {*}
                 */
                this.afterValue = undefined;
            },

            /**
             * @param {*} beforeValue
             * @returns {$basicWidgets.InputStateChangeEvent}
             */
            setBeforeValue: function (beforeValue) {
                this.beforeValue = beforeValue;
                return this;
            },

            /**
             * @param {*} afterValue
             * @returns {$basicWidgets.InputStateChangeEvent}
             */
            setAfterValue: function (afterValue) {
                this.afterValue = afterValue;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.InputStateChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.beforeValue = this.beforeValue;
                result.afterValue = this.afterValue;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'InputStateChangeEvent', function (eventName) {
            return eventName === 'widget.change.input.state';
        }, 1);
});
