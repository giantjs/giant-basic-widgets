$oop.postpone($basicWidgets, 'Hyperlink', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * Creates a Hyperlink instance.
     * @name $basicWidgets.Hyperlink.create
     * @function
     * @returns {$basicWidgets.Hyperlink}
     */

    /**
     * Implements a basic hyperlink.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Hyperlink = self
        .addMethods(/** @lends $basicWidgets.Hyperlink# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('a');

                this.spawnTextWidget()
                    .setChildName('link-text')
                    .addToParent(this);
            },

            /**
             * Creates Text widget to be used inside the link.
             * Override to specify custom widget.
             * @returns {$basicWidgets.Text}
             */
            spawnTextWidget: function () {
                return $basicWidgets.Text.create();
            },

            /**
             * Retrieves the text widget contained within the link.
             * @returns {$basicWidgets.Text}
             */
            getTextWidget: function () {
                return this.getChild('link-text');
            },

            /**
             * Sets URL for the link.
             * @param {string} targetUrl
             * @returns {$basicWidgets.Hyperlink}
             */
            setTargetUrl: function (targetUrl) {
                this.htmlAttributes.setItem('href', targetUrl);
                return this;
            },

            /**
             * Retrieves URL associated with the link.
             * @returns {string}
             */
            getTargetUrl: function () {
                return this.htmlAttributes.getItem('href');
            },

            /**
             * Sets the link's text content.
             * @param {string} contentString
             * @returns {$basicWidgets.Hyperlink}
             */
            setContentString: function (contentString) {
                this.getTextWidget()
                    .setContentString(contentString);
                return this;
            }
        });
});
