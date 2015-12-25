$oop.postpone(window, 'TestPage', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Page,
        self = base.extend(cn);

    /**
     * @name window.TestPage.create
     * @function
     * @returns {window.TestPage}
     */

    /**
     * Lists various widgets implemented in giant-basic-widgets.
     * @class
     * @extends $basicWidgets.Page
     */
    window.TestPage = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addPrivateMethods(/** @lends window.TestPage# */{
            //@formatter:off
/** @private */
_addPlainText: function () {
    return $basicWidgets.Text.create()
        .setContentString("<em>Hello</em>");
},

/** @private */
_addEntityBoundText: function () {
    // setting initial field value
    'user/1/name'.toField()
        .setValue("<em>Hello</em>");

    return $basicWidgets.DataText.create('user/1/name'.toFieldKey());
},

/** @private */
_addLocaleBoundText: function () {
    // initializing translations
    'locale/en-uk'.toDocument()
        .setTranslations({
            "Hi!": "Hi!"
        });
    'locale/de-de'.toDocument()
        .setTranslations({
            "Hi!": "Gruß dich!"
        });
    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('en-uk'.toLocale())
        .markLocaleAsReady('de-de'.toLocale());

    // setting current locale to 'de-de'
    'de-de'.toLocale().setAsCurrentLocale();

    return $basicWidgets.LocaleText.create()
        .setOriginalContentString("Hi!".toTranslatable());
},
            //@formatter:on

            /**
             * @param {function} widgetSpawner
             * @param {string|$utils.Stringifiable} hintString
             * @private
             */
            _addWidget: function (widgetSpawner, hintString) {
                this.getChild('widget-list')
                    .addItemWidget(widgetSpawner(), hintString, widgetSpawner.toString());
            }
        })
        .addMethods(/** @lends window.TestPage# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                $basicWidgets.Text.create()
                    .setTagName('h1')
                    .setContentString("Giant Basic Widgets")
                    .addToParent(this);

                TestList.create()
                    .setChildName('widget-list')
                    .addToParent(this);

                // TODO: add switch to modify encoding, input field to modify text
                this._addWidget(
                    this._addPlainText,
                    "widgetId.toWidget().setHtmlEscaped(false)");

                // TODO: connect up with corresponding data input field(s)
                this._addWidget(
                    this._addEntityBoundText,
                    "entityKey.toField().setValue('Jane')");

                // TODO: add language selector
                this._addWidget(
                    this._addLocaleBoundText,
                    "'en-uk'.toLocale().setAsCurrentLocale()");
            }
        });
});

$oop.amendPostponed($routing, 'Route', function () {
    "use strict";

    [].toRoute()
        .subscribeTo($routing.EVENT_ROUTE_CHANGE, function () {
            // activating TestPage on any route change
            TestPage.create().setAsActivePage();
        });
});
