(function () {
    "use strict";

    module("TextArea");

    test("Instantiation", function () {
        var textarea = $basicWidgets.TextArea.create();
        equal(textarea.tagName, 'textarea', "should set tagName property");
        ok(textarea.hasOwnProperty('inputValue'), "should add inputValue property");
    });

    test("Input value setter", function () {
        expect(1);

        var textarea = $basicWidgets.TextArea.create();

        textarea.addMocks({
            _updateDom: function () {
                equal(this.inputValue, 'foo', "should set inputValue property");
            }
        });

        textarea.setInputValue("foo");
    });

    test("Input value clear", function () {
        expect(1);

        var textarea = $basicWidgets.TextArea.create();

        textarea.addMocks({
            _updateDom: function () {
                equal(typeof this.inputValue, 'undefined', "should clear inputValue property");
            }
        });

        textarea.clearInputValue();
    });
}());
