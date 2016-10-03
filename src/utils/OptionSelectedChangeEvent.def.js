$oop.postpone($basicWidgets, 'OptionSelectedChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.OptionSelectedChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.OptionSelectedChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.OptionSelectedChangeEvent = self
        .addMethods(/** @lends $basicWidgets.OptionSelectedChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {boolean}
                 */
                this.wasSelected = undefined;

                /**
                 * @type {boolean}
                 */
                this.isSelected = undefined;
            },

            /**
             * @param {boolean} wasSelected
             * @returns {$basicWidgets.OptionSelectedChangeEvent}
             */
            setWasSelected: function (wasSelected) {
                this.wasSelected = wasSelected;
                return this;
            },

            /**
             * @param {boolean} isSelected
             * @returns {$basicWidgets.OptionSelectedChangeEvent}
             */
            setIsSelected: function (isSelected) {
                this.isSelected = isSelected;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.OptionSelectedChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.wasSelected = this.wasSelected;
                result.isSelected = this.isSelected;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'OptionSelectedChangeEvent', function (eventName) {
            return eventName === 'widget.change.option.selected';
        }, 1);
});
