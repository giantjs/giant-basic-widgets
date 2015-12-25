(function () {
    "use strict";

    module("List");

    test("Instantiation", function () {
        var list = $basicWidgets.List.create();

        equal(list.tagName, 'ul', "should set tagName property to UL");
    });

    test("Item addition", function () {
        var list = $basicWidgets.List.create(),
            item = $widget.Widget.create();

        strictEqual(list.addItemWidget(item), list, "should be chainable");
        strictEqual(item.parent, list, "should add item to list as child");
        equal(item.tagName, 'li', "should set item's tagName property to li");
    });
}());
