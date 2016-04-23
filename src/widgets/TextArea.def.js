$oop.postpone($basicWidgets, 'TextArea', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DirectInput,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.TextArea.create
     * @function
     * @returns {$basicWidgets.TextArea}
     */

    /**
     * @class
     * @extends $basicWidgets.DirectInput
     */
    $basicWidgets.TextArea = self
        .addPrivateMethods(/** @lends $basicWidgets.TextArea# */{
            /** @private */
            _updateDom: function () {
                var element = this.getElement();
                if (element) {
                    element.value = $utils.Stringifier.stringify(this.value);
                }
            },

            /**
             * @returns {string}
             * @private
             */
            _getValue: function () {
                return this.value;
            },

            /**
             * @param {string} value
             * @private
             */
            _setValue: function (value) {
                this.value = value;
                this._updateDom();
            },

            /** @private */
            _clearValue: function () {
                this.value = undefined;
                this._updateDom();
            }
        })
        .addMethods(/** @lends $basicWidgets.TextArea# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('textarea');

                /**
                 * Value associated with text area.
                 * @type {string}
                 */
                this.value = undefined;
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateDom();
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return $utils.Stringifier.stringify(this.value).toHtml();
            }
        });
});
