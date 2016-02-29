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
             * Retrieves document key for validator associated with input.
             * @returns {$entity.DocumentKey}
             */
            getValidatorKey: function () {
                var validatorRef = this.getField('validator').getValue();
                return validatorRef && validatorRef.toDocumentKey();
            },

            /**
             * Sets document key identifying validator to be associated with input.
             * @param {$entity.DocumentKey} validatorKey
             * @returns {$basicWidgets.InputDocument}
             * @see $basicWidgets.ValidatorDocument
             */
            setValidatorKey: function (validatorKey) {
                this.getField('validator').setValue(validatorKey.toString());
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
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onValueChange: function (event) {
                var valueBefore = event.beforeNode,
                    valueAfter = event.afterNode,
                    validatorKey = this.getValidatorKey(),
                    validatorDocument = validatorKey && validatorKey.toDocument(),
                    wasValid, isValid;

                if (validatorDocument) {
                    // fetching validity of old and new input values
                    wasValid = validatorDocument.validate(valueBefore);
                    isValid = validatorDocument.validate(valueAfter);

                    if (wasValid !== isValid) {
                        // TODO: Use custom validity event class.
                        this.entityKey.spawnEvent($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE)
                            .setPayloadItems({
                                wasValid: wasValid,
                                isValid : isValid
                            })
                            .triggerSync();
                    }
                }
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

$oop.amendPostponed($entity, 'entityEventSpace', function () {
    "use strict";

    $entity.entityEventSpace
        .subscribeTo(
            $entity.EVENT_ENTITY_CHANGE,
            'entity>document>input'.toPath(),
            function (event) {
                var affectedKey = event.sender,
                    beforeNode = event.beforeNode,
                    afterNode = event.afterNode,
                    documentKey,
                    valueBefore,
                    valueAfter;

                if (affectedKey.isA($entity.DocumentKey)) {
                    // input document node changed
                    documentKey = affectedKey;
                    valueBefore = beforeNode && beforeNode.value;
                    valueAfter = afterNode && afterNode.value;
                    if (valueBefore !== valueAfter) {
                        documentKey.toDocument()
                            .onValueChange(event.clone()
                                .setAffectedKey(affectedKey)
                                .setBeforeNode(valueBefore)
                                .setAfterNode(valueAfter));
                    }
                } else if (affectedKey.isA($entity.FieldKey)) {
                    // input value field changed
                    documentKey = affectedKey.documentKey;
                    documentKey.toDocument()
                        .onValueChange(event);
                }
            });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that the validity of an input has changed.
         * @constant
         */
        EVENT_INPUT_VALIDITY_CHANGE: 'widget.input.validity-change'
    });
}());
