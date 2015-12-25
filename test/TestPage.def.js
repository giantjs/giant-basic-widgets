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
            /**
             * TODO: add switch to modify encoding, input field to modify text
             * @private
             */
            _addPlainText: function () {
                this.getChild('widget-list')
                    .addItemWidget($basicWidgets.Text.create()
                        .setContentString("<em>Hello</em>"));
            },

            /**
             * TODO: connect up with corresponding data input field(s)
             * @private
             */
            _addEntityBoundText: function () {
                'user/1/name'.toField()
                    .setValue("<em>Hello</em>");

                this.getChild('widget-list')
                    .addItemWidget($basicWidgets.DataText.create('user/1/name'.toFieldKey()));
            },

            /**
             * TODO: add language selector
             * @private
             */
            _addLocaleBoundText: function () {
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

                'de-de'.toLocale().setAsCurrentLocale();

                this.getChild('widget-list')
                    .addItemWidget($basicWidgets.LocaleText.create()
                        .setOriginalContentString("Hi!".toTranslatable()));
            }
        })
        .addMethods(/** @lends window.TestPage# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                $basicWidgets.List.create()
                    .setChildName('widget-list')
                    .addToParent(this);

                this._addPlainText();
                this._addEntityBoundText();
                this._addLocaleBoundText();
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
