(function () {
    "use strict";

    module("Application", {
        setup: function () {
            $basicWidgets.Application.clearInstanceRegistry();
        },

        teardown: function () {
            $basicWidgets.Application.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        expect(2);

        $widget.Widget.addMocks({
            setRootWidget: function () {
                ok(true, "should set Application widget as root");
            }
        });

        var application = $basicWidgets.Application.create();
        strictEqual($basicWidgets.Application.create(), application,
            "should be singleton");

        $widget.Widget.removeMocks();
    });
}());
