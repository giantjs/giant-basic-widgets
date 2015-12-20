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
     * TODO: Add tests for events.
     * @class
     * @extends $basicWidgets.Text
     * @extends $i18n.LocaleBound
     */
    $basicWidgets.LocaleText = self
        .addPrivateMethods(/** @lends $basicWidgets.LocaleText# */{
            /** @private */
            _updateContentString: function () {
                this.setContentString($utils.Stringifier.stringify(this.originalContentString));
            }
        })
        .addMethods(/** @lends $basicWidgets.LocaleText# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);
                $i18n.LocaleBound.init.call(this);

                this.elevateMethod('onParameterValuesChange');

                /**
                 * @type {$templating.LiveTemplate|$i18n.Translatable}
                 */
                this.originalContentString = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateContentString();
                this.bindToCurrentLocaleReady('onCurrentLocaleReady');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromCurrentLocaleReady('onCurrentLocaleReady');
            },

            /**
             * @param {$templating.LiveTemplate|$i18n.Translatable} originalContentString
             * @returns {$basicWidgets.LocaleText}
             */
            setOriginalContentString: function (originalContentString) {
                var oldOriginalContentString = this.originalContentString;

                this.originalContentString = originalContentString;

                if ($templating.LiveTemplate.isBaseOf(oldOriginalContentString)) {
                    oldOriginalContentString
                        .unsubscribeFrom($templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE, this.onParameterValuesChange);
                }

                if ($templating.LiveTemplate.isBaseOf(originalContentString)) {
                    originalContentString
                        .subscribeTo($templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE, this.onParameterValuesChange);
                }

                return this;
            },

            /** @ignore */
            onCurrentLocaleReady: function () {
                this._updateContentString();
            },

            /** @ignore */
            onParameterValuesChange: function () {
                this._updateContentString();
            }
        });
});
