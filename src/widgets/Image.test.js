(function () {
    "use strict";

    module("Image");

    test("Instantiation", function () {
        var image = $basicWidgets.Image.create();
        equal(image.tagName, 'img', "should set tagName to img");
    });

    test("Image URL setter", function () {
        var image = $basicWidgets.Image.create();
        strictEqual(image.setImageUrl('http://foo.com/img.jpg'), image, "should be chainable");
        equal(image.htmlAttributes.getItem('src'), 'http://foo.com/img.jpg',
            "should set 'src' attribute");
    });

    test("Image URL getter", function () {
        var image = $basicWidgets.Image.create()
            .setImageUrl('http://foo.com/img.jpg');

        equal(image.getImageUrl(), 'http://foo.com/img.jpg',
            "should return value of 'src' attribute");
    });
}());
