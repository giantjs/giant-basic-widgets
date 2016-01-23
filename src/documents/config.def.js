$oop.amendPostponed($entity, 'config', function () {
    "use strict";

    $entity.config.appendNode('document>field'.toPath(), {
        // form values set / selected by the user
        'form/values': {fieldType: 'collection'},

        // identifies input within form
        'input/name' : {fieldType: 'reference'}
    });
});
