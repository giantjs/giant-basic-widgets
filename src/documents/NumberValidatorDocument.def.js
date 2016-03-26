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
             * Retrieves the minimum value for the number to validate.
             * Returning undefined means there is no minimum value.
             * @returns {number}
             */
            getMinValue: function () {
                return this.getField('minValue').getValue();
            },

            /**
             * Retrieves the maximum value for the number to validate.
             * Returning undefined means there is no maximum value.
             * @returns {number}
             */
            getMaxValue: function () {
                return this.getField('maxValue').getValue();
            },

            /**
             * @param {number} value
             * @returns {boolean}
             */
            validate: function (value) {
                var minValue = this.getMinValue(),
                    maxValue = this.getMaxValue();

                return !isNaN(value) &&
                    (minValue === undefined || value >= minValue) &&
                    (maxValue === undefined || value <= maxValue);
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'NumberValidatorDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'numberValidator';
        }, 1);
});
