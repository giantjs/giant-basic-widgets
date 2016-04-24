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
                    // TODO: Use proxy
                    element.value = $utils.Stringifier.stringify(this.value);
                }
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
            },

            /**
             * @param {string} value
             * @returns {$basicWidgets.TextArea}
             */
            setValue: function (value) {
                var oldValue = this.value;
                if (value !== oldValue) {
                    this.value = value;
                    this._updateDom();

                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(oldValue)
                        .setAfterValue(value)
                        .triggerSync();
                }
                return this;
            },

            /**
             * @returns {$basicWidgets.TextArea}
             */
            clearValue: function () {
                var oldValue = this.value;
                if (oldValue) {
                    this.value = undefined;
                    this._updateDom();

                    this.spawnEvent($basicWidgets.EVENT_INPUT_STATE_CHANGE)
                        .setBeforeValue(oldValue)
                        .triggerSync();
                }
                return this;
            },

            /**
             * @returns {string}
             */
            getValue: function () {
                return this.value;
            }
        });
});
