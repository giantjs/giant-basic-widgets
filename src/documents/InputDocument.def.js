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
     * Represents an input component, including its name, value, and state.
     * Manages validation.
     * An input document is valid when it either does not have a validator associated,
     * or the associated validator evaluates to true.
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.InputDocument = self
        .addPrivateMethods(/** @lends $basicWidgets.InputDocument# */{
            /**
             * Validates current input value.
             * TODO: Break down to further private methods.
             * @private
             */
            _validate: function () {
                var validatorKey = this.getValidatorKey(),
                    validatorDocument = validatorKey && validatorKey.toDocument(),
                    reasonsField = this.getField('_reasons'),
                    newReasons = (validatorDocument && validatorDocument.validate(this.getInputValue()) || [])
                        .toCollection()
                        .mapKeys(function (reason) {
                            return reason;
                        })
                        .mapValues(function () {
                            return true;
                        })
                        .toSet(),
                    oldReasons = reasonsField
                        .getItemsAsCollection()
                        .toSet(),
                    reasonsToAdd = newReasons
                        .subtract(oldReasons)
                        .toCollection(),
                    reasonsToRemove = oldReasons
                        .subtract(newReasons)
                        .toCollection();

                if (!reasonsField.getValue()) {
                    // setting initial value for reasons, in case value starts out valid
                    reasonsField.setValue({});
                }

                // adding new reasons
                reasonsToAdd
                    .mapValues(function (t, reason) {
                        return reasonsField.getItem(reason);
                    })
                    .callOnEachItem('setValue', true);

                // removing reasons that no longer apply
                reasonsToRemove
                    .mapValues(function (t, reason) {
                        return reasonsField.getItem(reason);
                    })
                    .callOnEachItem('unsetKey');
            }
        })
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
             * TODO: Revisit from a validation POV.
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
             * Determines the validity of the input document's current value.
             * @returns {boolean}
             */
            getValidity: function () {
                var reasonCount = this.getField('_reasons')
                    .getItemsAsCollection()
                    .getKeyCount();

                return reasonCount === 0;
            },

            /**
             * Retrieves current state value associated with the input.
             * @returns {*}
             */
            getInputState: function () {
                return this.getField('state').getValue();
            },

            /**
             * @param event
             * @ignore
             */
            onDocumentChange: function (event) {
                var documentKey = event.sender,
                    beforeNode = event.beforeNode,
                    afterNode = event.afterNode,
                    valueBefore = beforeNode && beforeNode.value,
                    valueAfter = afterNode && afterNode.value,
                    validatorRefBefore = beforeNode && beforeNode.validator,
                    validatorRefAfter = afterNode && afterNode.validator;

                var validityBefore = beforeNode && beforeNode._reasons,
                    validityAfter = afterNode && afterNode._reasons;

                if (valueAfter !== valueBefore ||
                    validatorRefAfter !== validatorRefBefore
                ) {
                    // when either value or validator changes
                    // re-validating current state
                    this._validate();
                }

                if (validityAfter !== validityBefore) {
                    // when validity flag changes
                    // calling appropriate field change handler
                    this.onValidityChange(event.clone()
                        .setSender(documentKey.getFieldKey('_reasons'))
                        .setAffectedKey(documentKey)
                        .setBeforeNode(validityBefore)
                        .setAfterNode(validityAfter));
                }
            },

            /** @ignore */
            onValueChange: function () {
                this._validate();
            },

            /** @ignore */
            onValidatorChange: function () {
                this._validate();
            },

            /**
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onValidityChange: function (event) {
                var reasonsBefore = event.beforeNode,
                    reasonsAfter = event.afterNode;

                if (typeof reasonsAfter === 'undefined') {
                    // validity has been removed
                    // re-validating
                    this._validate();
                } else {
                    // TODO: Use custom validity event class.
                    this.entityKey.spawnEvent($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE)
                        .setPayloadItems({
                            wasValid: reasonsBefore,
                            isValid: reasonsAfter
                        })
                        .triggerSync();
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
                    documentKey;

                if (affectedKey.isA($entity.DocumentKey)) {
                    // entire input document changed
                    documentKey = affectedKey;

                    documentKey.toDocument()
                        .onDocumentChange(event);
                } else if (affectedKey.isA($entity.FieldKey)) {
                    // one of the fields changed
                    documentKey = affectedKey.documentKey;

                    switch (affectedKey.fieldName) {
                    case 'value':
                        // input value field changed
                        documentKey.toDocument()
                            .onValueChange(event);
                        break;

                    case 'validator':
                        // input validator field changed
                        documentKey.toDocument()
                            .onValidatorChange(event);
                        break;

                    case '_reasons':
                        // input validator field changed
                        documentKey.toDocument()
                            .onValidityChange(event);
                        break;
                    }
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
