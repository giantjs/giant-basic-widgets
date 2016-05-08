(function () {
    "use strict";

    module("Valuable");

    var Valuable = $widget.Widget.extend('Valuable')
        .addTraitAndExtend($basicWidgets.Valuable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.Valuable.init.call(this);
            },
            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.Valuable.afterRender.call(this);
            }
        });

    test("Instantiation", function () {
        var valuable = Valuable.create();
        ok(valuable.hasOwnProperty('value'), "should add value property");
    });

    test("Value setter", function () {
        expect(3);

        var valuable = Valuable.create();

        valuable.addMocks({
            _updateDomValue: function () {
                ok(true, "should update value in DOM");
            }
        });

        strictEqual(valuable.setValue('foo'), valuable, "should be chainable");
        equal(valuable.value, 'foo', "should set value property");
    });
}());
