(function () {
    "use strict";

    module("OptionSelectedChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.OptionSelectedChangeEvent.create(
            'widget.change.option.selected',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('wasSelected'), "should add wasSelected property");
        ok(event.hasOwnProperty('isSelected'), "should add isSelected property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.change.option.selected', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.OptionSelectedChangeEvent),
            "should return OptionSelectedChangeEvent instance");
    });

    test("Before value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.option.selected');
        strictEqual(event.setWasSelected(true), event, "should be chainable");
        equal(event.wasSelected, true, "should set wasSelected property");
    });

    test("After value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.option.selected');
        strictEqual(event.setIsSelected(true), event, "should be chainable");
        equal(event.isSelected, true, "should set isSelected property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.option.selected')
            .setWasSelected(true)
            .setIsSelected(false),
            clone = event.clone('baz'.toPath());

        ok(clone.isA($basicWidgets.OptionSelectedChangeEvent), "should return OptionSelectedChangeEvent");
        equal(clone.wasSelected, event.wasSelected, "should copy wasSelected property");
        equal(clone.isSelected, event.isSelected, "should copy isSelected property");
    });
}());
