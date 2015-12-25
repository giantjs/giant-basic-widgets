$oop.postpone($basicWidgets, 'List', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.List.create
     * @function
     * @returns {$basicWidgets.List}
     */

    /**
     * Aggregates widgets. Item order is determined by items' childName properties.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.List = self
        .addMethods(/** @lends $basicWidgets.List# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('ul');
            },

            /**
             * Adds item to list. Changes item's tagName property to 'li'.
             * @param itemWidget
             * @returns {$basicWidgets.List}
             */
            addItemWidget: function (itemWidget) {
                itemWidget
                    .setTagName('li')
                    .addToParent(this);
                return this;
            }
        });
});
