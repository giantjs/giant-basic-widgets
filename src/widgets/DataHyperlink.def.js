$oop.postpone($basicWidgets, 'DataHyperlink', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Hyperlink,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityWidget);

    /**
     * Creates a DataHyperlink instance.
     * @name $basicWidgets.DataHyperlink.create
     * @function
     * @param {$entity.FieldKey} urlKey Identifies the URL associated with the link.
     * @param {$entity.FieldKey} textKey Identifies the text associated with the link.
     * @returns {$basicWidgets.DataHyperlink}
     */

    /**
     * Displays a link based on the value of a field in the cache.
     * Keeps the target URL in sync with the changes of the corresponding field.
     * This is a general implementation with independent fields for URL and text.
     * @class
     * @extends $basicWidgets.Hyperlink
     * @extends $basicWidgets.EntityWidget
     */
    $basicWidgets.DataHyperlink = self
        .addPrivateMethods(/** @lends $basicWidgets.DataHyperlink# */{
            /** @private */
            _updateTargetUrl: function () {
                var targetUrl = this.entityKey.toField().getValue();
                this.setTargetUrl(targetUrl);
            }
        })
        .addMethods(/** @lends $basicWidgets.DataHyperlink# */{
            /**
             * @param {$entity.FieldKey} urlKey
             * @param {$entity.FieldKey} textKey
             * @ignore
             */
            init: function (urlKey, textKey) {
                $assertion
                    .isFieldKey(urlKey, "Invalid URL field key")
                    .isFieldKey(textKey, "Invalid text field key");

                /**
                 * Field key that identifies the text
                 * @type {$entity.FieldKey}
                 */
                this.textKey = textKey;

                base.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, urlKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateTargetUrl();
                this.bindToDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /**
             * Creates default databound Text widget based on the textKey provided at instantiation.
             * Override to specify custom widget.
             * @returns {$basicWidgets.DataText}
             */
            spawnTextWidget: function () {
                return $basicWidgets.DataText.create(this.textKey);
            },

            /** @ignore */
            onUrlChange: function () {
                this._updateTargetUrl();
            }
        });
});
