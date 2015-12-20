(function () {
    "use strict";

    module("Text");

    test("Instantiation", function () {
        var text = $basicWidgets.Text.create();
        equal(typeof text.contentString, 'undefined', "should add contentString property");
        equal(text.htmlEscaped, true, "should set htmlEscaped property to true");
    });

    test("Html escape setter", function () {
        expect(2);

        var text = $basicWidgets.Text.create();

        text.addMocks({
            _updateDom: function () {
                ok(true, "should update DOM");
            }
        });

        // should not trigger any changes
        text.setHtmlEscaped(true);

        text.setHtmlEscaped(false);

        equal(text.htmlEscaped, false, "should set htmlEscaped property");
    });

    test("Text text setter", function () {
        expect(3);

        var text = $basicWidgets.Text.create();

        text.addMocks({
            _updateDom: function () {
                ok(true, "should update DOM");
            },

            _updateStyle: function () {
                ok(true, "should update CSS");
            }
        });

        // should not trigger any changes
        text.setContentString("foo");

        equal(text.contentString, "foo", "should set contentString property");
    });
}());
