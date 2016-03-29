$oop.postpone($basicWidgets, 'RegexpValidatorDocument', function () {
    "use strict";

    var base = $basicWidgets.ValidatorDocument,
        self = base.extend();

    /**
     * @name $basicWidgets.RegexpValidatorDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.ValidatorDocument}
     */

    /**
     * Describes regular expression based validation.
     * Validation fails when the string does not match the regexp.
     * @class
     * @extends $basicWidgets.ValidatorDocument
     */
    $basicWidgets.RegexpValidatorDocument = self
        .addConstants(/** @lends $basicWidgets.RegexpValidatorDocument */{
            /**
             * Signals that the value does not match the specified regexp.
             * @constant
             */
            REASON_REGEXP_MISMATCH: 'validation-reason.regexp-mismatch'
        })
        .addMethods(/** @lends $basicWidgets.RegexpValidatorDocument# */{
            /**
             * @returns {string}
             */
            getRegexp: function () {
                return this.getField('regexp').getValue();
            },

            /**
             * @param {string} value
             * @returns {string[]}
             */
            validate: function (value) {
                var regexp = this.getRegexp(),
                    result = [];

                if (regexp && !new RegExp(regexp).test(value)) {
                    result.push(self.REASON_REGEXP_MISMATCH);
                }

                return result;
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'RegexpValidatorDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'regexpValidator';
        }, 1);
});
