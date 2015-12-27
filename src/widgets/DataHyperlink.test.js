(function () {
    "use strict";

    module("DataHyperlink");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataHyperlink.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataHyperlink.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var urlKey = 'link/1/url'.toFieldKey(),
            textKey = 'link/1/text'.toFieldKey(),
            dataHyperlink = $basicWidgets.DataHyperlink.create(urlKey, textKey);

        strictEqual(dataHyperlink.textKey, textKey, "should set textKey property");
    });

    test("URL change handler", function () {
        expect(1);

        var dataHyperlink = $basicWidgets.DataHyperlink.create(
            'link/1/url'.toFieldKey(),
            'link/1/text'.toFieldKey());

        dataHyperlink.afterAdd();

        dataHyperlink.addMocks({
            _updateTargetUrl: function () {
                ok(true, "should update target URL");
            }
        });

        'link/1/url'.toFieldKey().spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo')
            .setAfterNode('bar')
            .triggerSync();

        dataHyperlink.afterRemove();
    });
}());
