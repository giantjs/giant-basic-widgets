$oop.postpone($basicWidgets, 'Label', function (ns, className) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates a Label instance.
     * @name $basicWidgets.Label.create
     * @function
     * @returns {$basicWidgets.Label}
     */

    /**
     * Displays text, optionally HTML escaped, based on a string literal or stringifiable object.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Label = self
        .addPrivateMethods(/** @lends $basicWidgets.Label# */{
            /**
             * Updates Label's CSS classes based on its content.
             * @private
             */
            _updateLabelStyle: function () {
                var labelText = $utils.Stringifier.stringify(this.labelText);
                if (labelText) {
                    this
                        .removeCssClass('no-text')
                        .addCssClass('has-text');
                } else {
                    this
                        .removeCssClass('has-text')
                        .addCssClass('no-text');
                }
            },

            /** @private */
            _updateLabelDom: function () {
                var element = this.getElement(),
                    currentLabelText;

                if (element) {
                    currentLabelText = $utils.Stringifier.stringify(this.labelText);
                    element.innerHTML = this.htmlEscaped ?
                        currentLabelText.toHtml() :
                        currentLabelText;
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Label# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /**
                 * Text or text provider associated with Label.
                 * TODO: Rename to exclude "label"
                 * @type {string|$utils.Stringifiable}
                 */
                this.labelText = undefined;

                /**
                 * Whether label HTML escapes text before rendering.
                 * @type {boolean}
                 */
                this.htmlEscaped = true;

                this.setTagName('span');

                this._updateLabelStyle();
            },

            /** @ignore */
            contentMarkup: function () {
                var currentLabelText = $utils.Stringifier.stringify(this.labelText);
                return this.htmlEscaped ?
                    currentLabelText.toHtml() :
                    currentLabelText;
            },

            /**
             * Sets flag that determines whether label will HTML escape text before rendering.
             * Use with care: script embedded in labelText might compromise security!
             * @param {boolean} htmlEscaped
             * @returns {$basicWidgets.Label}
             */
            setHtmlEscaped: function (htmlEscaped) {
                if (this.htmlEscaped !== htmlEscaped) {
                    this.htmlEscaped = htmlEscaped;
                    this._updateLabelDom();
                }
                return this;
            },

            /**
             * Sets text to display on label. Accepts strings or objects that implement .toString().
             * Displayed text will be HTML encoded.
             * @param {string|$utils.Stringifiable} labelText
             * @returns {$basicWidgets.Label}
             */
            setLabelText: function (labelText) {
                if (this.labelText !== labelText) {
                    this.labelText = labelText;
                    this._updateLabelDom();
                    this._updateLabelStyle();
                }
                return this;
            }
        });
});
