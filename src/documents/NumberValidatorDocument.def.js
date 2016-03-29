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
     * Describes number validation.
     * Validation might fail in case the value is
     * a) not a number
     * b) too low (optional)
     * c) too high (optional)
     * @class
     * @extends $basicWidgets.ValidatorDocument
     */
    $basicWidgets.NumberValidatorDocument = self
        .addConstants(/** @lends $basicWidgets.NumberValidatorDocument */{
            /**
             * Signals that the value was not a number.
             * @constant
             */
            REASON_NAN: 'validation-reason.not-a-number',

            /**
             * Signals that the value was lower than the minimum.
             * @constant
             */
            REASON_TOO_LOW: 'validation-reason.too-low',

            /**
             * Signals that the value exceeded the maximum value.
             * @constant
             */
            REASON_TOO_HIGH: 'validation-reason.too-high'
        })
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
             * @returns {string[]}
             */
            validate: function (value) {
                var isNumber = !isNaN(value),
                    minValue = this.getMinValue(),
                    maxValue = this.getMaxValue(),
                    result = [];

                if (!isNumber) {
                    result.push(self.REASON_NAN);
                }

                if (minValue !== undefined && value < minValue) {
                    result.push(self.REASON_TOO_LOW);
                }

                if (maxValue !== undefined && value > maxValue) {
                    result.push(self.REASON_TOO_HIGH);
                }

                return result;
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
