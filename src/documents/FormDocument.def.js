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
     * TODO: Add name - value association extractor.
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.FormDocument = self
        .addMethods(/** @lends $basicWidgets.FormDocument# */{
            /**
             * Sets value associated with a specific input.
             * @param {$entity.DocumentKey} inputKey Identifies input
             * @param {*} inputValue Value associated with input
             * @returns {$basicWidgets.FormDocument}
             */
            setInputValue: function (inputKey, inputValue) {
                this.getField('values').getItem(inputKey.toString()).setValue(inputValue);
                return this;
            },

            /**
             * Clears value associated with a specific input.
             * @param {$entity.DocumentKey} inputKey
             * @returns {$basicWidgets.FormDocument}
             */
            clearInputValue: function (inputKey) {
                this.getField('values').getItem(inputKey.toString()).unsetKey();
                return this;
            },

            /**
             * Retrieves value associated with a specific input.
             * @param {$entity.DocumentKey} inputKey
             * @returns {*}
             */
            getInputValue: function (inputKey) {
                return this.getField('values').getItem(inputKey.toString()).getValue();
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
