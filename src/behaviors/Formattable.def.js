$oop.postpone($basicWidgets, 'Formattable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Endows text-related Widget with optional formatting.
     * Updates the DOM with formatted text.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.Widget
     */
    $basicWidgets.Formattable = self
        .addMethods(/** @lends $basicWidgets.Formattable# */{
            /**
             * Call from host's init
             */
            init: function () {
                /**
                 * Holds string filters.
                 * @type {$basicWidgets.StringFilterCollection}
                 */
                this.stringFilters = $basicWidgets.StringFilterCollection.create();

                /**
                 * Holds IDs of active filters.
                 * @type {$data.Collection}
                 */
                this.activeStringFilterIds = $data.Collection.create();
            },

            /**
             * @param {string} filterId
             * @param {$basicWidgets.StringFilter} stringFilter
             * @param {boolean} [isActive=true]
             * @returns {$basicWidgets.Formattable}
             */
            addFormatter: function (filterId, stringFilter, isActive) {
                this.stringFilters.setItem(filterId, stringFilter);
                if (isActive !== false) {
                    this.activeStringFilterIds.setItem(filterId, filterId);
                }
                this.applyFilters();
                return this;
            },

            /**
             * @param {string} filterId
             * @returns {$basicWidgets.Formattable}
             */
            activateFormatter: function (filterId) {
                var activeFilterIds = this.activeStringFilterIds,
                    stringFilter = this.stringFilters.getItem(filterId),
                    wasActive = activeFilterIds.getItem(filterId);

                if (stringFilter && !wasActive) {
                    activeFilterIds.setItem(filterId, filterId);
                    this.applyFilters();
                }

                return this;
            },

            /**
             * @param {string} filterId
             * @returns {$basicWidgets.Formattable}
             */
            deactivateFormatter: function (filterId) {
                var activeFilterIds = this.activeStringFilterIds,
                    stringFilter = this.stringFilters.getItem(filterId),
                    wasActive = activeFilterIds.getItem(filterId);

                if (stringFilter && wasActive) {
                    activeFilterIds.deleteItem(filterId);
                    this.applyFilters();
                }

                return this;
            },

            /**
             * @returns {string}
             */
            getFormattedString: function () {
                return this.stringFilters
                    .filterByKeys(this.activeStringFilterIds.getValues())
                    .filter(this.getOriginalString());
            },

            /**
             * Applies format to DOM.
             * @returns {$basicWidgets.Formattable}
             */
            applyFilters: function () {
                var element = this.getElement();
                if (element) {
                    this.setDomString(this.getFormattedString());
                }
                return this;
            }
        });

    /**
     * Retrieves original unformatted string from widget state.
     * @name $basicWidgets.Formattable#getOriginalString
     * @function
     * @returns {string|$utils.Stringifiable}
     */

    /**
     * Updates DOM with formatted string.
     * @name $basicWidgets.Formattable#setDomString
     * @function
     * @param {string} contentString
     * @returns {$basicWidgets.Formattable}
     */
});
