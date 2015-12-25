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
        .addMethods(/** @lends window.TestPage# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                // Plain text
                // TODO: add switch to modify encoding, input field to modify text
                $basicWidgets.Text.create()
                        .setContentString("<em>Hello</em>")
                        .addToParent(this);
    
                // Entity-bound text
                // TODO: connect up with corresponding data input field(s)
                'user/1/name'.toField()
                        .setValue("<em>Hello</em>");
                $basicWidgets.DataText.create('user/1/name'.toFieldKey())
                        .addToParent(this);
    
                // Locale-bound text
                // TODO: add language selector
                'locale/en-uk'.toDocument().setTranslations({
                    "Hi!": "Hi!"
                });
                'locale/de-de'.toDocument().setTranslations({
                    "Hi!": "Gruß dich!"
                });
                $i18n.LocaleEnvironment.create()
                        .markLocaleAsReady('en-uk'.toLocale())
                        .markLocaleAsReady('de-de'.toLocale());
                'de-de'.toLocale().setAsCurrentLocale();
                $basicWidgets.LocaleText.create()
                        .setOriginalContentString("Hi!".toTranslatable())
                        .addToParent(this);
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
