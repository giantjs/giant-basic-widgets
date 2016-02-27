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
                    element.value = $utils.Stringifier.stringify(this.inputValue);
                }
            },

            /**
             * @returns {string}
             * @private
             */
            _getInputValue: function () {
                return this.inputValue;
            },

            /**
             * @param {string} inputValue
             * @private
             */
            _setInputValue: function (inputValue) {
                this.inputValue = inputValue;
                this._updateDom();
            },

            /** @private */
            _clearInputValue: function () {
                this.inputValue = undefined;
                this._updateDom();
            }
        })
        .addMethods(/** @lends $basicWidgets.TextArea# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('textarea');

                /**
                 * @type {string}
                 */
                this.inputValue = undefined;
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
                return $utils.Stringifier.stringify(this.inputValue).toHtml();
            }
        });
});
