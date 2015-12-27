(function () {
    "use strict";

    module("Hyperlink");

    test("Instantiation", function () {
        expect(3);

        $basicWidgets.Hyperlink.addMocks({
            spawnTextWidget: function () {
                ok(true, "should spawn Text widget");
                return $basicWidgets.Text.create();
            }
        });

        var hyperlink = $basicWidgets.Hyperlink.create();

        equal(hyperlink.tagName, 'a', "should set tagName property");
        ok(hyperlink.getChild('link-text').isA($basicWidgets.Text),
            "should add child widget for text");

        $basicWidgets.Hyperlink.removeMocks();
    });

    test("Text widget getter", function () {
        var hyperlink = $basicWidgets.Hyperlink.create();

        strictEqual(hyperlink.getTextWidget(), hyperlink.getChild('link-text'),
            "should return child widget");
    });

    test("Target URL setter", function () {
        expect(3);

        var hyperlink = $basicWidgets.Hyperlink.create();

        hyperlink.addMocks({
            addAttribute: function (attributeName, attributeValue) {
                equal(attributeName, 'href', "should set href attribute");
                equal(attributeValue, 'http://foo.com', "should set target URL as href");
            }
        });

        strictEqual(hyperlink.setTargetUrl('http://foo.com'), hyperlink,
            "should be chainable");
    });

    test("Target URL getter", function () {
        var hyperlink = $basicWidgets.Hyperlink.create()
            .setTargetUrl('http://foo.com');

        equal(hyperlink.getTargetUrl(), hyperlink.htmlAttributes.getItem('href'),
            "should return 'href' attribute");
    });

    test("Content string setter", function () {
        expect(3);

        var hyperlink = $basicWidgets.Hyperlink.create();

        $basicWidgets.Text.addMocks({
            setContentString: function (contentString) {
                strictEqual(this, hyperlink.getChild('link-text'),
                    "should set content of texh child widget");
                equal(contentString, 'Hello', "should set content string");
            }
        });

        strictEqual(hyperlink.setContentString('Hello'), hyperlink, "should be chainable");

        $basicWidgets.Text.removeMocks();
    });
}());
