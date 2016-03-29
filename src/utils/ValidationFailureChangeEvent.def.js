$oop.postpone($basicWidgets, 'ValidationFailureChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.ValidationFailureChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.ValidationFailureChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.ValidationFailureChangeEvent = self
        .addMethods(/** @lends $basicWidgets.ValidationFailureChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {object}
                 */
                this.reasonsBefore = undefined;

                /**
                 * @type {object}
                 */
                this.reasonsAfter = undefined;
            },

            /**
             * @param {object} reasonsBefore
             * @returns {$basicWidgets.ValidationFailureChangeEvent}
             */
            setReasonsBefore: function (reasonsBefore) {
                this.reasonsBefore = reasonsBefore;
                return this;
            },

            /**
             * @param {object} reasonsAfter
             * @returns {$basicWidgets.ValidationFailureChangeEvent}
             */
            setReasonsAfter: function (reasonsAfter) {
                this.reasonsAfter = reasonsAfter;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.ValidationFailureChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.reasonsAfter = this.reasonsAfter;
                result.reasonsBefore = this.reasonsBefore;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'ValidationFailureChangeEvent', function (eventName) {
            var prefix = 'widget.validation-failure.change';
            return eventName.substr(0, prefix.length) === prefix;
        }, 1);
});
