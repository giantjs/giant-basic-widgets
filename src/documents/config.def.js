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
        'input/baseValue': {},
        'input/validator': {fieldType: 'reference'},
        'input/_reasons' : {fieldType: 'collection'},

        'option/value'      : {fieldType: 'string'},
        'option/description': {fieldType: 'string'},

        'select/options': {fieldType: 'collection'},

        'numberValidator/minValue': {fieldType: 'number'},
        'numberValidator/maxValue': {fieldType: 'number'},

        'stringValidator/minLength': {fieldType: 'number'},
        'stringValidator/maxLength': {fieldType: 'number'}
    });
});
