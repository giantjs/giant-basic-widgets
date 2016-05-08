(function () {
    "use strict";

    module("TextArea");

    test("Instantiation", function () {
        var textarea = $basicWidgets.TextArea.create();
        equal(textarea.tagName, 'textarea', "should set tagName property");
        ok(textarea.hasOwnProperty('value'), "should add value property");
    });

    test("Input value setter", function () {
        expect(1);

        var textarea = $basicWidgets.TextArea.create();

        textarea.addMocks({
            _updateDom: function () {
                equal(this.value, 'foo', "should set value property");
            }
        });

        textarea.setValue("foo");
    });
}());
