$oop.postpone(window, 'TestList', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn);

    /**
     * @name window.TestList.create
     * @function
     * @returns {window.TestList}
     */

    /**
     * @class
     * @extends $basicWidgets.List
     */
    window.TestList = self
        .addMethods(/** @lends window.TestList# */{
            /**
             * @param {$widget.Widget} itemWidget
             * @param {string|$utils.Stringifiable} hintString
             * @returns {TestList}
             */
            addItemWidget: function (itemWidget, hintString) {
                base.addItemWidget.call(this, TestListItem.create()
                    .setContentWidget(itemWidget)
                    .setHintString(hintString));
                return this;
            }
        });
});
