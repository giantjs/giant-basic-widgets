$oop.amendPostponed($entity, 'config', function () {
    "use strict";

    $entity.config.appendNode('document>field'.toPath(), {
        'form/inputs': {
            fieldType : 'collection',
            itemIdType: 'reference',
            itemType  : 'reference'
        },

        'input/name' : {fieldType: 'string'},
        'input/value': {},
        'input/state': {}
    });
});
