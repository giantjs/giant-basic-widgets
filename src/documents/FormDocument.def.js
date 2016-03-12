$oop.postpone($basicWidgets, 'FormDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name $basicWidgets.FormDocument.create
     * @function
     * @param {$entity.DocumentKey} documentKey
     * @returns {$basicWidgets.FormDocument}
     */

    /**
     * @class
     * @extends $entity.Document
     */
    $basicWidgets.FormDocument = self
        .addMethods(/** @lends $basicWidgets.FormDocument# */{
            /**
             * Adds input to form.
             * @param {$entity.DocumentKey} inputKey
             * @returns {$basicWidgets.FormDocument}
             */
            addInput: function (inputKey) {
                var inputRef = inputKey.toString();
                this.getField('inputs').getItem(inputRef).setValue(inputRef);
                return this;
            },

            /**
             * Removes item from the form.
             * @param {$entity.DocumentKey} inputKey
             * @returns {$basicWidgets.FormDocument}
             */
            removeInput: function (inputKey) {
                var inputRef = inputKey.toString();
                this.getField('inputs').getItem(inputRef).unsetKey();
                return this;
            },

            /**
             * Extracts values from inputs associated with the form.
             * TODO: Take state into consideration.
             * @returns {$data.Dictionary}
             */
            getInputValues: function () {
                var result = $data.Dictionary.create();

                this.getField('inputs').getItemsAsCollection()
                    .forEachItem(function (inputRef) {
                        var inputDocument = inputRef.toDocument(),
                            inputName = inputDocument.getInputName(),
                            inputValue = inputDocument.getInputValue();

                        result.addItem(inputName, inputValue);
                    });

                return result;
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onInputValidityChange: function (event) {
                var inputKey = event.sender,
                    payload = event.payload,
                    isRestValid;

                // determining whether rest of the fields are valid
                isRestValid = this.getField('inputs').getItemsAsCollection()
                    .clone()
                    .deleteItem(inputKey.toString())
                    .mapValues(function (inputRef) {
                        return inputRef.toDocument().getValidity();
                    })
                    .getValues()
                    .reduce(function (curr, next) {
                        return curr && next;
                    }, true);

                if (isRestValid) {
                    this.entityKey.spawnEvent($basicWidgets.EVENT_FORM_VALIDITY_CHANGE)
                        .setPayloadItems({
                            wasValid: payload.wasValid,
                            isValid : payload.isValid
                        })
                        .triggerSync();
                }
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate($basicWidgets, 'FormDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'form';
        });
});

$oop.amendPostponed($entity, 'entityEventSpace', function () {
    "use strict";

    $entity.entityEventSpace.subscribeTo(
        $basicWidgets.EVENT_INPUT_VALIDITY_CHANGE,
        'entity>document>input'.toPath(),
        function (event) {
            var inputKey = event.sender,
                inputQuery = ['document', 'form', '{|}'.toKVP(), 'inputs', inputKey.toString()].toQuery();

            // TODO: Think about return value.
            // TODO: Revisit as soon as giant-entity supports back-references.
            // allows inputs to be associated with multiple forms
            $entity.entities.queryKeysAsHash(inputQuery)
                .toCollection()
                .mapValues(function (formId) {
                    return ['form', formId].toDocument();
                })
                .callOnEachItem('onInputValidityChange', event);
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that the validity of an entire form has changed.
         * @constant
         */
        EVENT_FORM_VALIDITY_CHANGE: 'widget.form.validity-change'
    });
}());
