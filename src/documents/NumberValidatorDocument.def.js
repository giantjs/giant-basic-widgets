$oop.postpone($basicWidgets, 'NumberValidatorDocument', function () {
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
    $basicWidgets.NumberValidatorDocument = self
        .addMethods(/** @lends $basicWidgets.StringValidatorDocument# */{
            /**
             * @param {*} value
             * @returns {boolean}
             */
            validate: function (value) {
                return !isNaN(parseInt(value, 10));
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
