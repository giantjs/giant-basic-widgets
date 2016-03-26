$oop.postpone($basicWidgets, 'ValidatorDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name $basicWidgets.ValidatorDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.ValidatorDocument}
     */

    /**
     * Represents an input component, including its name, value, state, and validity.
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.ValidatorDocument = self
        .addMethods(/** @lends $basicWidgets.ValidatorDocument# */{
            /**
             * Determines whether the specified value is valid,
             * according to the current validator's validation rules.
             * Override for specific documents to provide custom validation rules.
             * @param {*} value
             * @returns {string[]} List of reason identifiers for failing validation.
             * When array length is zero, validation succeeded.
             */
            validate: function (value) {
                return [];
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'ValidatorDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'validator';
        });
});
