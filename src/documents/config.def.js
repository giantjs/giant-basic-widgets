$oop.amendPostponed($entity, 'config', function () {
    "use strict";

    $entity.config.appendNode('document>field'.toPath(), {
        'form/inputs': {
            fieldType : 'collection',
            itemIdType: 'reference',
            itemType  : 'reference'
        },

        'input/name'     : {fieldType: 'string'},
        'input/value'    : {},
        'input/state'    : {},
        'input/validator': {fieldType: 'reference'},
        'input/_reasons' : {fieldType: 'collection'},

        'numberValidator/minValue': {fieldType: 'number'},
        'numberValidator/maxValue': {fieldType: 'number'},

        'stringValidator/minLength': {fieldType: 'number'},
        'stringValidator/maxLength': {fieldType: 'number'}
    });
});
