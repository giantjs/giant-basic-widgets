$oop.postpone($basicWidgets, 'NumberValidatorDocument', function () {
    "use strict";

    var base = $basicWidgets.ValidatorDocument,
        self = base.extend();

    /**
     * @name $basicWidgets.NumberValidatorDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.ValidatorDocument}
     */

    /**
     * Implements string validation.
     * @class
     * @extends $basicWidgets.ValidatorDocument
     */
    $basicWidgets.NumberValidatorDocument = self
        .addMethods(/** @lends $basicWidgets.NumberValidatorDocument# */{
            /**
             * @param {*} value
             * @returns {boolean}
             */
            validate: function (value) {
                return !isNaN(value);
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'NumberValidatorDocument', function (documentKey) {
            return documentKey.equals('validator/number'.toDocumentKey());
        }, 1);
});
