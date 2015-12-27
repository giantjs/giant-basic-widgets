$oop.postpone($basicWidgets, 'InputDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name $basicWidgets.InputDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.InputDocument}
     */

    /**
     * TODO: Add tests for getter-setters.
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.InputDocument = self
        .addMethods(/** @lends $basicWidgets.InputDocument# */{
            /**
             * @param {string} description
             * @returns {$basicWidgets.InputDocument}
             */
            setDescription: function (description) {
                this.getField('description').setValue(description);
                return this;
            },

            /**
             * Retrieves description string associated with input.
             * @returns {string}
             */
            getDescription: function () {
                return this.getField('description').getValue();
            },

            /**
             * @param {string} groupId
             * @returns {$basicWidgets.InputDocument}
             */
            setGroupId: function (groupId) {
                this.getField('groupId').setValue(groupId);
                return this;
            },

            /**
             * Retrieves group ID associated with input.
             * @returns {string}
             */
            getGroupId: function () {
                return this.getField('groupId').getValue();
            },

            /**
             * @param {*} value
             * @returns {$basicWidgets.InputDocument}
             */
            setValue: function (value) {
                this.getField('value').setValue(value);
                return this;
            },

            /**
             * Retrieves current value associated with input.
             * @returns {*}
             */
            getValue: function () {
                return this.getField('value').getValue();
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'InputDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'input';
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /** @param {$basicWidgets.InputDocument} expr */
        isInputDocument: function (expr) {
            return $basicWidgets.InputDocument.isBaseOf(expr);
        },

        /** @param {$basicWidgets.InputDocument} [expr] */
        isInputDocumentOptional: function (expr) {
            return expr === undefined ||
                $basicWidgets.InputDocument.isBaseOf(expr);
        }
    });
}());