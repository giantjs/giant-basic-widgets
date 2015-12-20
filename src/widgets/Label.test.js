(function () {
    "use strict";

    module("Label");

    test("Instantiation", function () {
        var label = $basicWidgets.Label.create();
        equal(typeof label.labelText, 'undefined', "should add labelText property");
        equal(label.htmlEscaped, true, "should set htmlEscaped property to true");
    });

    test("Html escape setter", function () {
        expect(2);

        var label = $basicWidgets.Label.create();

        label.addMocks({
            _updateLabelDom: function () {
                ok(true, "should update DOM");
            }
        });

        // should not trigger any changes
        label.setHtmlEscaped(true);

        label.setHtmlEscaped(false);

        equal(label.htmlEscaped, false, "should set htmlEscaped property");
    });

    test("Label text setter", function () {
        expect(3);

        var label = $basicWidgets.Label.create();

        label.addMocks({
            _updateLabelDom: function () {
                ok(true, "should update DOM");
            },

            _updateLabelStyle: function () {
                ok(true, "should update CSS");
            }
        });

        // should not trigger any changes
        label.setLabelText("foo");

        equal(label.labelText, "foo", "should set labelText property");
    });
}());
