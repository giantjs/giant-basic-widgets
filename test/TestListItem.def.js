$oop.postpone(window, 'TestListItem', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * @name window.TestListItem.create
     * @function
     * @returns {window.TestListItem}
     */

    /**
     * @class
     * @extends $widget.Widget
     */
    window.TestListItem = self
        .addPublic(/** @lends window.TestListItem */{
            /** @type {$widget.MarkupTemplate} */
            contentTemplate: [
                '<div class="name-container"></div>',
                '<div class="widget-container"></div>',
                '<div class="hint-container"></div>'
            ].join('').toMarkupTemplate()
        })
        .addMethods(/** @lends window.TestListItem# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-class-name')
                    .setTagName('h2')
                    .setContainerCssClass('name-container')
                    .addToParent(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-hint')
                    .setHtmlEscaped(false)
                    .setContainerCssClass('hint-container')
                    .addToParent(this);
            },

            /**
             * @param {$widget.Widget} contentWidget
             * @returns {TestListItem}
             */
            setContentWidget: function (contentWidget) {
                contentWidget
                    .setContainerCssClass('widget-container')
                    .addToParent(this);

                this.getChild('widget-class-name')
                    .setContentString(contentWidget.className);

                return this;
            },

            /**
             * @param {string|$utils.Stringifiable} hintString
             * @returns {TestListItem}
             */
            setHintString: function (hintString) {
                this.getChild('widget-hint')
                    .setContentString(hintString);
                return this;
            }
        });
});
