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
     * Describes string validation.
     * Validation might fail in case the value is
     * a) too short (optional)
     * b) too long (optional)
     * @class
     * @extends $basicWidgets.ValidatorDocument
     */
    $basicWidgets.StringValidatorDocument = self
        .addConstants(/** @lends $basicWidgets.StringValidatorDocument */{
            /**
             * Signals that the value was shorter than the minimum length.
             * @constant
             */
            REASON_TOO_SHORT: 'validation-reason.too-short',

            /**
             * Signals that the value' length exceeded the maximum.
             * @constant
             */
            REASON_TOO_LONG: 'validation-reason.too-long'
        })
        .addMethods(/** @lends $basicWidgets.StringValidatorDocument# */{
            /**
             * Retrieves the minimum length for the string to validate.
             * Returning undefined means there is no minimum length.
             * @returns {number}
             */
            getMinLength: function () {
                return this.getField('minLength').getValue();
            },

            /**
             * Retrieves the maximum length for the string to validate.
             * Returning undefined means there is no maximum length.
             * @returns {number}
             */
            getMaxLength: function () {
                return this.getField('maxLength').getValue();
            },

            /**
             * @param {string} value
             * @returns {string[]}
             */
            validate: function (value) {
                var length = value && value.length || 0,
                    minLength = this.getMinLength(),
                    maxLength = this.getMaxLength(),
                    result = [];

                if (minLength !== undefined && length < minLength) {
                    result.push(self.REASON_TOO_SHORT);
                }

                if (maxLength !== undefined && length > maxLength) {
                    result.push(self.REASON_TOO_LONG);
                }

                return result;
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'StringValidatorDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'stringValidator';
        }, 1);
});
