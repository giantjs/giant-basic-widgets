$oop.postpone($basicWidgets, 'LocaleText', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTrait($i18n.LocaleBound);

    /**
     * Creates a LocaleText instance.
     * @name $basicWidgets.LocaleText.create
     * @function
     * @returns {$basicWidgets.LocaleText}
     */

    /**
     * Shorthand for templated & localized text that updates on
     * locale change (locale 'ready' change) and changing template parameters.
     * TODO: Add tests for events.
     * @class
     * @extends $basicWidgets.Text
     * @extends $i18n.LocaleBound
     */
    $basicWidgets.LocaleText = self
        .addMethods(/** @lends $basicWidgets.LocaleText# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);
                $i18n.LocaleBound.init.call(this);

                this.elevateMethod('onParameterValuesChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.bindToCurrentLocaleReady('onCurrentLocaleReady');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromCurrentLocaleReady('onCurrentLocaleReady');
            },

            /**
             * @param {$templating.LiveTemplate|$i18n.Translatable} contentString
             * @returns {$basicWidgets.LocaleText}
             */
            setContentString: function (contentString) {
                var oldContentString = this.contentString;

                base.setContentString.call(this, contentString);

                if ($templating.LiveTemplate.isBaseOf(oldContentString)) {
                    oldContentString.unsubscribeFrom(
                        $templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE,
                        this.onParameterValuesChange);
                }

                if ($templating.LiveTemplate.isBaseOf(contentString)) {
                    contentString.subscribeTo(
                        $templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE,
                        this.onParameterValuesChange);
                }

                return this;
            },

            /** @ignore */
            onCurrentLocaleReady: function () {
                this.applyFilters();
            },

            /** @ignore */
            onParameterValuesChange: function () {
                this.applyFilters();
            }
        });
});
