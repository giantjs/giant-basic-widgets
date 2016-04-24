(function () {
    "use strict";

    module("Controllable");

    var Controllable = $widget.Widget.extend('Controllable')
        .addTraitAndExtend($basicWidgets.BinaryStateful)
        .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
        .addTraitAndExtend($basicWidgets.Controllable, 'Controllable')
        .addMethods({
            init           : function (inputType) {
                $widget.Widget.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
            },
            afterAdd       : function () {
                $widget.Widget.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.Controllable.afterAdd.call(this);
            },
            afterRemove    : function () {
                $widget.Widget.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },
            afterStateOn   : function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Controllable.afterStateOn.call(this, stateName);
            },
            afterStateOff  : function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Controllable.afterStateOff.call(this, stateName);
            }
        });

    test("State-on handler override", function () {
        expect(1);

        var input = Controllable.create();

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.disableBy('foo');
    });

    test("State-off handler override", function () {
        expect(1);

        var input = Controllable.create()
            .disableBy('foo');

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.enableBy('foo');
    });
    test("Label widget setter", function () {
        var input = Controllable.create(),
            label = $basicWidgets.Text.create();

        strictEqual(input.linkLabelWidget(label), input, "should be chainable");
        equal(label.tagName, 'label', "should change label tagName property to 'label'");
        equal(label.htmlAttributes.getItem('for'), input.htmlAttributes.idAttribute,
            "should set 'for' attribute to input ID");
    });
    test("Controllable name setter", function () {
        expect(3);

        var input = Controllable.create();

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            }
        });

        strictEqual(input.setName('foo'), input, "should be chainable");
        equal(input.htmlAttributes.getItem('name'), 'foo', "should set name attribute");
    });

    test("Controllable name removal", function () {
        expect(3);

        var input = Controllable.create();

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            },

            removeAttribute: function (attrName) {
                equal(attrName, 'name', "should remove name attribute");
            }
        });

        strictEqual(input.clearName(), input, "should be chainable");
    });

    test("Controllable name getter", function () {
        var input = Controllable.create()
            .setName('foo');

        equal(input.getName(), 'foo', "should return name attribute");
    });
}());
