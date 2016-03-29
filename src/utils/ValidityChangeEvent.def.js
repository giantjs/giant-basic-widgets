$oop.postpone($basicWidgets, 'ValidityChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.ValidityChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.ValidityChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.ValidityChangeEvent = self
        .addMethods(/** @lends $basicWidgets.ValidityChangeEvent# */{
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
                this.wasValid = undefined;

                /**
                 * @type {*}
                 */
                this.isValid = undefined;
            },

            /**
             * @param {boolean} wasValid
             * @returns {$basicWidgets.ValidityChangeEvent}
             */
            setWasValid: function (wasValid) {
                this.wasValid = wasValid;
                return this;
            },

            /**
             * @param {boolean} isValid
             * @returns {$basicWidgets.ValidityChangeEvent}
             */
            setIsValid: function (isValid) {
                this.isValid = isValid;
                return this;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'ValidityChangeEvent', function (eventName) {
            var prefix = 'widget.validity.change';
            return eventName.substr(0, prefix.length) === prefix;
        }, 1);
});
