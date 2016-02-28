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
     * Represents an input component, including its name, value, state, and validity.
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.InputDocument = self
        .addMethods(/** @lends $basicWidgets.InputDocument# */{
            /**
             * Sets name associated with the input. The name field identifies
             * the input in the form, as well as groups inputs having the same name.
             * @param {string} groupId
             * @returns {$basicWidgets.InputDocument}
             */
            setInputName: function (groupId) {
                this.getField('name').setValue(groupId);
                return this;
            },

            /**
             * Retrieves name associated with input.
             * @returns {string}
             */
            getInputName: function () {
                return this.getField('name').getValue();
            },

            /**
             * Sets current value associated with the input.
             * @param {*} value
             * @returns {$basicWidgets.InputDocument}
             */
            setInputValue: function (value) {
                this.getField('value').setValue(value);
                return this;
            },

            /**
             * Retrieves current value associated with input.
             * @returns {*}
             */
            getInputValue: function () {
                return this.getField('value').getValue();
            },

            /**
             * Sets current state value associated with the input.
             * Input state may be controlled independently from value,
             * but they may contribute to the form together.
             * @param {*} state
             * @returns {$basicWidgets.InputDocument}
             */
            setInputState: function (state) {
                this.getField('state').setValue(state);
                return this;
            },

            /**
             * Retrieves current state value associated with the input.
             * @returns {*}
             */
            getInputState: function () {
                return this.getField('state').getValue();
            },

            /**
             * Determines validity based on the current input value and state.
             * Override in subclass to provide custom validity checker.
             * @returns {boolean}
             */
            isValid: function () {
                return true;
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
