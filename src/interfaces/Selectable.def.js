/**
 * Describes widgets that might be selected or deselected.
 * Expects to be added to widgets.
 * @name $basicWidgets.Selectable
 * @extends $widget.Widget
 * @interface
 */

/**
 * Tells whether the widget is selected
 * @name $basicWidgets.Selectable#selected
 * @type {boolean|undefined}
 */

/**
 * Selects widget.
 * @name $basicWidgets.Selectable#select
 * @function
 * @returns {$basicWidgets.Selectable}
 */

/**
 * Deselects widget.
 * @name $basicWidgets.Selectable#deselect
 * @function
 * @returns {$basicWidgets.Selectable}
 */

/**
 * Sets base value of selectable.
 * The selectable takes this value when selected.
 * @name $basicWidgets.Selectable#setValue
 * @param {string} value
 * @function
 * @returns {$basicWidgets.Selectable}
 */

/**
 * Retrieves the base value of the selectable.
 * @name $basicWidgets.Selectable#getValue
 * @function
 * @returns {string}
 */
