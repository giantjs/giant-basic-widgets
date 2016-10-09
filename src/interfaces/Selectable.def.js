/**
 * Describes widgets that might be selected or deselected.
 * Expects to be added to widgets.
 * TODO: What about BinaryStateful?
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
