(function () {
    "use strict";

    module("ValidityChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.ValidityChangeEvent.create(
            'widget.validity.change',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('wasValid'), "should add wasValid property");
        ok(event.hasOwnProperty('isValid'), "should add isValid property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.validity.change.foo', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.ValidityChangeEvent),
            "should return ValidityChangeEvent instance");
    });

    test("Before value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validity.change');
        strictEqual(event.setWasValid(true), event, "should be chainable");
        equal(event.wasValid, true, "should set wasValid property");
    });

    test("After value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validity.change');
        strictEqual(event.setIsValid(true), event, "should be chainable");
        equal(event.isValid, true, "should set isValid property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.validity.change')
            .setWasValid(true)
            .setIsValid(false),
            clone = event.clone('foo'.toPath());

        ok(clone.isA($basicWidgets.ValidityChangeEvent), "should return ValidityChangeEvent");
        equal(clone.wasValid, event.wasValid, "should copy wasValid property");
        equal(clone.isValid, event.isValid, "should copy isValid property");
    })
}());
