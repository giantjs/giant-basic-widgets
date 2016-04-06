$oop.postpone($basicWidgets, 'DataList', function (ns, className) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(className)
            .addTrait($basicWidgets.EntityWidget);

    /**
     * Creates a DataList instance.
     * @name $basicWidgets.DataList.create
     * @function
     * @param {$entity.FieldKey} fieldKey Key to an ordered reference collection.
     * @returns {$basicWidgets.DataList}
     */

    /**
     * The DataList maintains a list of widgets based on a collection field.
     * Keeps list in sync with the changes of the corresponding collection.
     * Expects to be bound to a field of field type 'collection',
     * and item ID type 'reference'.
     * TODO: Add single item value change handler.
     * @class
     * @extends $basicWidgets.List
     * @extends $entity.EntityBound
     * @extends $basicWidgets.EntityWidget
     */
    $basicWidgets.DataList = self
        .addPrivateMethods(/** @lends $basicWidgets.DataList# */{
            /**
             * TODO: Break down to smaller functions.
             * @private
             */
            _updateItemWidgets: function () {
                var fieldKey = this.entityKey,

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
                        .passEachItemTo(this.spawnItemWidget, this)
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
        .addMethods(/** @lends $basicWidgets.DataList# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion
                    .isFieldKey(fieldKey, "Invalid field key")
                    .assert(fieldKey.getFieldType() === 'collection', "Invalid field type");

                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, fieldKey);

                /**
                 * @type {$data.Collection}
                 */
                this.itemIdToChildName = $data.Collection.create();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateItemWidgets();
                this.bindToEntityChange(this.entityKey, 'onItemsChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromEntityChange(this.entityKey, 'onItemsChange');
            },

            /**
             * Creates item widget for the specified item key.
             * To specify a custom widget class, either override this method in a subclass, or provide
             * a surrogate definition on DataText, in case the custom item widget is also DataText-based.
             * @param {$entity.ReferenceItemKey} itemKey
             * @returns {$widget.Widget}
             */
            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataText.create(itemKey)
                    .setChildName(this.spawnItemName(itemKey));
            },

            /**
             * Retrieves the item childName associated with the specified itemKey. (Child name determines order.)
             * To specify custom child name for item widgets, override this method.
             * TODO: Rename to 'spawnItemOrder' once giant-widget supports independent child ordering.
             * @param {$entity.ItemKey} itemKey
             * @returns {string}
             */
            spawnItemName: function (itemKey) {
                return itemKey.itemId;
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
             * @ignores
             */
            onItemsChange: function () {
                this._updateItemWidgets();
            }
        });
});
