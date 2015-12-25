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
             * @param {string} codeString
             * @returns {TestList}
             */
            addItemWidget: function (itemWidget, hintString, codeString) {
                base.addItemWidget.call(this, TestListItem.create()
                    .setContentWidget(itemWidget)
                    .setHintString(hintString)
                    .setCodeString(codeString));
                return this;
            }
        });
});
