$oop.postpone($basicWidgets, 'StringValidatorDocument', function () {
    "use strict";

    var base = $basicWidgets.ValidatorDocument,
        self = base.extend();

    /**
     * @name $basicWidgets.StringValidatorDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.ValidatorDocument}
     */

    /**
     * Implements string validation.
     * @class
     * @extends $basicWidgets.ValidatorDocument
     */
    $basicWidgets.StringValidatorDocument = self
        .addMethods(/** @lends $basicWidgets.StringValidatorDocument# */{
            /**
             * @param {string} value
             * @returns {boolean}
             */
            validate: function (value) {
                return $assertion.validators.isString(value);
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'StringValidatorDocument', function (documentKey) {
            return documentKey.equals('validator/string'.toDocumentKey());
        }, 1);
});
