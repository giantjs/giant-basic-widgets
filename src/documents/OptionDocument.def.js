$oop.postpone($basicWidgets, 'OptionDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name $basicWidgets.OptionDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.OptionDocument}
     */

    /**
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.OptionDocument = self
        .addMethods(/** @lends $basicWidgets.OptionDocument# */{
            /**
             * Sets the option's value.
             * @param {string} value
             * @returns {$basicWidgets.OptionDocument}
             */
            setValue: function (value) {
                this.getField('value').setValue(value);
                return this;
            },

            /**
             * Retrieves the options's value.
             * @returns {string}
             */
            getValue: function () {
                return this.getField('value').getValue();
            },

            /**
             * Sets the description associated with the option.
             * @param {string} description
             * @returns {$basicWidgets.OptionDocument}
             */
            setDescription: function (description) {
                this.getField('description').setValue(description);
                return this;
            },

            /**
             * Retrieves the description associated with the option.
             * @returns {string}
             */
            getDescription: function () {
                return this.getField('description').getValue();
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'OptionDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'option';
        });
});
