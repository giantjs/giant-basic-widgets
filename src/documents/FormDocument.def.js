$oop.postpone($basicWidgets, 'FormDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name $basicWidgets.FormDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.FormDocument}
     */

    /**
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.FormDocument = self
        .addMethods(/** @lends $basicWidgets.FormDocument# */{
            /**
             * Adds input to form.
             * @param {$entity.DocumentKey} inputKey
             * @returns {$basicWidgets.FormDocument}
             */
            addInput: function (inputKey) {
                var inputRef = inputKey.toString();
                this.getField('inputs').getItem(inputRef).setValue(inputRef);
                return this;
            },

            /**
             * Removes item from the form.
             * @param {$entity.DocumentKey} inputKey
             * @returns {$basicWidgets.FormDocument}
             */
            removeInput: function (inputKey) {
                var inputRef = inputKey.toString();
                this.getField('inputs').getItem(inputRef).unsetKey();
                return this;
            },

            /**
             * Extracts values from inputs associated with the form.
             * TODO: Take state into consideration.
             * @returns {$data.Dictionary}
             */
            getInputValues: function () {
                var result = $data.Dictionary.create();

                this.getField('inputs').getItemsAsCollection()
                    .forEachItem(function (inputRef) {
                        var inputDocument = inputRef.toDocument(),
                            inputName = inputDocument.getInputName(),
                            inputValue = inputDocument.getInputValue();

                        result.addItem(inputName, inputValue);
                    });

                return result;
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'FormDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'form';
        });
});
