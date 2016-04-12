$oop.postpone($basicWidgets, 'EntityList', function () {
    "use strict";

    var base = $basicWidgets.EntityWidget,
        self = base.extend()
            .addTrait($basicWidgets.EntityWidget);

    /**
     * Enables list-like widgets to bind their children composition to a collection field.
     * Keeps list in sync with the changes of the corresponding collection.
     * Expects to be bound to a field of field type 'collection',
     * and item ID type 'reference'.
     * TODO: Add single item value change handler. (Depends on change in $entity.)
     * @class
     * @extends $basicWidgets.EntityWidget
     * @extends $basicWidgets.List
     */
    $basicWidgets.EntityList = self
        .addPrivateMethods(/** @lends $basicWidgets.EntityList# */{
            /** @private */
            _updateItemWidgets: function () {
                var that = this,
                    fieldKey = this.entityKey,

                // identifying new and current item IDs
                    itemIdsInCache = this.entityKey.toField()
                        .getItemsAsCollection()
                        .toSet(),
                    itemIdsInWidgets = this.itemIdToChildName.toSet(),

                // determining items to add & remove
                    itemKeysToRemove = itemIdsInWidgets.subtract(itemIdsInCache)
                        .toCollection()
                        .mapValues(function (value, itemId) {
                            return fieldKey.getItemKey(itemId);
                        }),
                    itemKeysToAdd = itemIdsInCache.subtract(itemIdsInWidgets)
                        .toCollection()
                        .mapValues(function (value, itemId) {
                            return fieldKey.getItemKey(itemId);
                        });

                // obtaining widgets based on
                var widgetsToRemove = itemKeysToRemove
                    .passEachItemTo(this.getItemWidgetByKey, this)
                    .filterByType($widget.Widget)
                    .toWidgetCollection(),
                    widgetsToAdd = itemKeysToAdd
                        .mapValues(function (itemKey) {
                            return that.spawnItemWidget(itemKey)
                                .setChildName(that.spawnItemName(itemKey));
                        })
                        .toWidgetCollection();

                // removing old widgets
                widgetsToRemove
                    .removeFromParent();

                // adding new widgets
                widgetsToAdd
                    .passEachItemTo(this.addItemWidget, this);

                // updating item ID to child name lookup
                this.itemIdToChildName = itemIdsInCache.toCollection()
                    .mapValues(function (value, itemId) {
                        return fieldKey.getItemKey(itemId);
                    })
                    .passEachItemTo(this.spawnItemName);
            }
        })
        .addMethods(/** @lends $basicWidgets.EntityList# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion
                    .isFieldKey(fieldKey, "Invalid field key")
                    .assert(fieldKey.getFieldType() === 'collection', "Invalid field type");

                base.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, fieldKey);

                /**
                 * Lookup between item IDs and child names for item widgets.
                 * @type {$data.Collection}
                 */
                this.itemIdToChildName = $data.Collection.create();
            },

            /**
             * Call from host's afterAdd()
             */
            afterAdd: function () {
                this._updateItemWidgets();
                this.bindToEntityChange(this.entityKey, 'onItemsChange');
            },

            /**
             * Call from host's afterRemove()
             */
            afterRemove: function () {
                this.unbindFromEntityChange(this.entityKey, 'onItemsChange');
            },

            /**
             * Fetches item widget by item key.
             * @param {$entity.ItemKey} itemKey
             * @returns {$widget.Widget}
             */
            getItemWidgetByKey: function (itemKey) {
                var childName = this.itemIdToChildName.getItem(itemKey.itemId);
                return this.getChild(childName);
            },

            /**
             * Called when at least one collection item gets added or removed.
             * @ignore
             */
            onItemsChange: function () {
                this._updateItemWidgets();
            }
        });

    /**
     * Creates item widget for the specified item key.
     * To specify a custom widget class, override this method in the host.
     * @name $basicWidgets.EntityList#spawnItemWidget
     * @function
     * @returns {$widget.Widget}
     */

    /**
     * Retrieves the item childName associated with the specified itemKey. (Child name determines order.)
     * To specify custom child name for item widgets, override this method.
     * TODO: Rename to 'spawnItemOrder' once giant-widget supports independent child ordering.
     * @name $basicWidgets.EntityList#spawnItemName
     * @function
     * @returns {string}
     */
});
