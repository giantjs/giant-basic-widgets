$oop.postpone($basicWidgets, 'Text', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * Creates a Text instance.
     * @name $basicWidgets.Text.create
     * @function
     * @returns {$basicWidgets.Text}
     */

    /**
     * Displays text, optionally HTML escaped, based on a string literal or Stringifiable object.
     * TODO: Move functionality to a partial class.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Text = self
        .addPrivateMethods(/** @lends $basicWidgets.Text# */{
            /**
             * Updates Text's CSS classes based on its content.
             * @private
             */
            _updateStyle: function () {
                var contentString = $utils.Stringifier.stringify(this.contentString);
                if (contentString) {
                    this
                        .removeCssClass('text-empty')
                        .addCssClass('text-has-content');
                } else {
                    this
                        .removeCssClass('text-has-content')
                        .addCssClass('text-empty');
                }
            },

            /** @private */
            _updateDom: function () {
                var element = this.getElement(),
                    currentLabelText;

                if (element) {
                    currentLabelText = $utils.Stringifier.stringify(this.contentString);
                    element.innerHTML = this.htmlEscaped ?
                        currentLabelText.toHtml() :
                        currentLabelText;
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Text# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /**
                 * String contents of the Text widget.
                 * @type {string|$utils.Stringifiable}
                 */
                this.contentString = undefined;

                /**
                 * Whether widget HTML escapes text before rendering.
                 * @type {boolean}
                 */
                this.htmlEscaped = true;

                this.setTagName('span');

                this._updateStyle();
            },

            /** @ignore */
            contentMarkup: function () {
                var currentContentString = $utils.Stringifier.stringify(this.contentString);
                return this.htmlEscaped ?
                    currentContentString.toHtml() :
                    currentContentString;
            },

            /**
             * Sets text to display on label. Accepts strings or objects that implement .toString().
             * Displayed text will be HTML encoded.
             * @param {string|$utils.Stringifiable} contentString
             * @returns {$basicWidgets.Text}
             */
            setContentString: function (contentString) {
                if (this.contentString !== contentString) {
                    this.contentString = contentString;
                    this._updateDom();
                    this._updateStyle();
                }
                return this;
            },

            /**
             * Sets flag that determines whether label will HTML escape text before rendering.
             * Use with care: script embedded in contentString might compromise security!
             * @param {boolean} htmlEscaped
             * @returns {$basicWidgets.Text}
             */
            setHtmlEscaped: function (htmlEscaped) {
                if (this.htmlEscaped !== htmlEscaped) {
                    this.htmlEscaped = htmlEscaped;
                    this._updateDom();
                }
                return this;
            }
        });
});
