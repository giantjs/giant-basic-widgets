(function () {
    "use strict";

    module("ValidationFailureChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.ValidationFailureChangeEvent.create(
            'widget.validation-failure.change',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('reasonsBefore'), "should add reasonsBefore property");
        ok(event.hasOwnProperty('reasonsAfter'), "should add reasonsAfter property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.validation-failure.change.foo', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.ValidationFailureChangeEvent),
            "should return ValidationFailureChangeEvent instance");
    });

    test("Before value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validation-failure.change');
        strictEqual(event.setReasonsBefore({}), event, "should be chainable");
        deepEqual(event.reasonsBefore, {}, "should set reasonsBefore property");
    });

    test("After value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validation-failure.change');
        strictEqual(event.setReasonsAfter({}), event, "should be chainable");
        deepEqual(event.reasonsAfter, {}, "should set reasonsAfter property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validation-failure.change')
            .setReasonsAfter({foo: 'bar'})
            .setReasonsBefore({baz: 'quux'}),
            clone = event.clone('foo'.toPath());

        ok(clone.isA($basicWidgets.ValidationFailureChangeEvent), "should return ValidationFailureChangeEvent");
        deepEqual(clone.reasonsBefore, event.reasonsBefore, "should copy reasonsBefore property");
        deepEqual(clone.reasonsAfter, event.reasonsAfter, "should copy reasonsAfter property");
    })
}());
