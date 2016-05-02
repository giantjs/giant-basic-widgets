$oop.postpone($basicWidgets, 'DataTextOption', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DataText,
        self = base.extend(cn)
            .addTrait($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Optionable);

    /**
     * Creates a DataTextOption instance.
     * @name $basicWidgets.DataTextOption.create
     * @function
     * @param {$entity.DocumentKey} optionKey
     * @param {$entity.FieldKey} [valueKey]
     * @returns {$basicWidgets.DataTextOption}
     */

    /**
     * A select option with static text inside.
     * @class
     * @extends $basicWidgets.DataText
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Optionable
     */
    $basicWidgets.DataTextOption = self
        .addPrivateMethods(/** @lends $basicWidgets.DataTextOption# */{
            /** @private */
            _syncValueToEntity: function () {
                var oldValue = this.getOptionValue(),
                    newValue = this.valueKey.toField().getValue();

                if (newValue !== oldValue) {
                    this.setOptionValue(newValue);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DataTextOption# */{
            /**
             * @param {$entity.FieldKey} descriptionKey
             * @param {$entity.FieldKey} [valueKey]
             * @ignore
             */
            init: function (descriptionKey, valueKey) {
                $assertion.isFieldKeyOptional(valueKey, "Invalid value key");

                base.init.call(this, descriptionKey);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Optionable.init.call(this);

                /**
                 * Identifies option value in the entity store.
                 * When absent, value is expected to be set via `setOptionValue`.
                 * @type {$entity.FieldKey}
                 */
                this.valueKey = valueKey;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);

                if (this.valueKey) {
                    this._syncValueToEntity();
                    this.bindToDelegatedEntityChange(this.valueKey, 'onValueChange');
                }
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);

                if (this.valueKey) {
                    this.unbindFromDelegatedEntityChange(this.valueKey, 'onValueChange');
                }
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.Optionable.afterRender.call(this);
            },

            /** @ignore */
            afterStateOn: function () {
                $basicWidgets.Disableable.afterStateOn.call(this);
                $basicWidgets.Optionable.afterStateOn.call(this);
            },

            /** @ignore */
            afterStateOff: function () {
                $basicWidgets.Disableable.afterStateOff.call(this);
                $basicWidgets.Optionable.afterStateOff.call(this);
            },

            /** @ignore */
            onValueChange: function () {
                this._syncValueToEntity();
            }
        });
});
