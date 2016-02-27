$oop.postpone($basicWidgets, 'DataTextArea', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.TextArea,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget)
            .addTraitAndExtend($basicWidgets.EntityInput);

    /**
     * @name $basicWidgets.DataTextArea.create
     * @function
     * @param {string} [type]
     * @param {$entity.DocumentKey} inputKey
     * @returns {$basicWidgets.DataTextArea}
     */

    /**
     * @class
     * @extends $basicWidgets.TextArea
     * @extends $basicWidgets.EntityWidget
     * @extends $basicWidgets.EntityInput
     */
    $basicWidgets.DataTextArea = self
        .addPrivateMethods(/** @lends $basicWidgets.DataTextArea# */{
            /** @private */
            _syncEntityToInputValue: function () {
                var inputDocument = this.entityKey.toDocument();
                inputDocument.setInputValue(this.getInputValue());
            }
        })
        .addMethods(/** @lends $basicWidgets.DataTextArea# */{
            /**
             * @param {$entity.DocumentKey} inputKey
             * @ignore
             */
            init: function (inputKey) {
                $assertion
                    .isDocumentKey(inputKey, "Invalid input key");

                base.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, inputKey);

                this.elevateMethod('onInputStateChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityInput.afterAdd.call(this);

                this.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);
            },

            /** @ignore */
            onInputStateChange: function () {
                this._syncEntityToInputValue();
            }
        });
});

