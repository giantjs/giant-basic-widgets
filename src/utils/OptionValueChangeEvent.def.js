$oop.postpone($basicWidgets, 'OptionValueChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.OptionValueChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.OptionValueChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.OptionValueChangeEvent = self
        .addMethods(/** @lends $basicWidgets.OptionValueChangeEvent# */{
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
             * @returns {$basicWidgets.OptionValueChangeEvent}
             */
            setBeforeValue: function (beforeValue) {
                this.beforeValue = beforeValue;
                return this;
            },

            /**
             * @param {*} afterValue
             * @returns {$basicWidgets.OptionValueChangeEvent}
             */
            setAfterValue: function (afterValue) {
                this.afterValue = afterValue;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.OptionValueChangeEvent}
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
        .addSurrogate($basicWidgets, 'OptionValueChangeEvent', function (eventName) {
            return eventName === 'widget.change.option.value';
        }, 1);
});
