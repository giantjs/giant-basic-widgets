$oop.postpone($basicWidgets, 'EntityWidget', function () {
    "use strict";

    var base = $entity.EntityBound,
        self = base.extend();

    /**
     * Provides means to link a widget to an entity.
     * Expects to be added to widget classes.
     * TODO: Add automatic binding? (We don't necessarily know where we want to capture.)
     * @class
     * @extends $entity.EntityBound
     * @extends $widget.Widget
     */
    $basicWidgets.EntityWidget = self
        .addConstants(/** @lends $basicWidgets.EntityWidget */{
            /** @constant */
            ATTRIBUTE_NAME_ENTITY_KEY: 'data-entity-key'
        })
        .addMethods(/** @lends $basicWidgets.EntityWidget# */{
            /**
             * @param {$entity.EntityKey} entityKey
             */
            init: function (entityKey) {
                base.init.call(this);

                /**
                 * Entity key associated with the widget.
                 * @type {$entity.EntityKey}
                 */
                this.entityKey = entityKey;
            },

            /**
             * Reveals the entity key associated with the widget
             * on the widget's DOM as an attribute.
             * @returns {$basicWidgets.EntityWidget}
             */
            revealKey: function () {
                this.addAttribute(self.ATTRIBUTE_NAME_ENTITY_KEY, this.entityKey.toString());
                return this;
            },

            /**
             * Hides the entity key associated with the widget from the DOM.
             * @returns {$basicWidgets.EntityWidget}
             */
            hideKey: function () {
                this.removeAttribute(self.ATTRIBUTE_NAME_ENTITY_KEY);
                return this;
            }
        });
});

$oop.postpone($basicWidgets, 'revealKeys', function () {
    "use strict";

    /**
     * Reveals entity keys on all widgets that have the EntityWidget trait.
     * Entity key strings will be added to widget elements as 'data-entity-key' attribute.
     * @type {function}
     */
    $basicWidgets.revealKeys = function () {
        $widget.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('revealKey');
    };
});

$oop.postpone($basicWidgets, 'hideKeys', function () {
    "use strict";

    /**
     * Removes 'data-entity-key' attribute from the DOM of all widgets that have the EntityWidget trait.
     * @type {function}
     */
    $basicWidgets.hideKeys = function () {
        $widget.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('hideKey');
    };
});
