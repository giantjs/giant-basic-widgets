$oop.postpone($basicWidgets, 'RadioGroup', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.SelectableLookupMaintainer)
            .addTraitAndExtend($basicWidgets.SingleOptionInputPartial)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable');

    /**
     * @name $basicWidgets.RadioGroup.create
     * @function
     * @returns {$basicWidgets.RadioGroup}
     */

    /**
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.SelectableLookupMaintainer
     * @extends $basicWidgets.SingleOptionInputPartial
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.RadioGroup = self
        .addMethods(/** @lends $basicWidgets.RadioGroup# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.SelectableLookupMaintainer.init.call(this);
                $basicWidgets.SingleOptionInputPartial.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                /**
                 * @type {string}
                 */
                this.inputName = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.SelectableLookupMaintainer.afterAdd.call(this);
                $basicWidgets.SingleOptionInputPartial.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
            },

            /**
             * @param {$widget.Widget} itemWidget
             * @returns {$basicWidgets.Selectable}
             */
            extractSelectableFromItemWidget: function (itemWidget) {
              return itemWidget.getAllDescendants()
                  .filterByType($basicWidgets.BinaryInput)
                  .getFirstValue();
            },

            /**
             * @param {$widget.Widget} itemWidget Supposed to contain one (and only one) BinaryInput.
             * @returns {$basicWidgets.RadioGroup}
             */
            addItemWidget: function (itemWidget) {
                base.addItemWidget.call(this, itemWidget);

                var selectable = this.extractSelectableFromItemWidget(itemWidget);
                $assertion.assert(selectable, "Item contains no input widget");

                $basicWidgets.SelectableLookupMaintainer.addItemWidget.call(this, selectable);
                $basicWidgets.SingleOptionInputPartial.addItemWidget.call(this, selectable);

                // making sure input name matches siblings
                selectable.setName(this.inputName);

                return this;
            },

            /**
             * @param {$widget.Widget} itemWidget Supposed to contain one (and only one) BinaryInput.
             * @returns {$basicWidgets.RadioGroup}
             */
            removeItemWidget: function (itemWidget) {
                base.removeItemWidget.call(this, itemWidget);

                var selectable = this.extractSelectableFromItemWidget(itemWidget);
                $assertion.assert(selectable, "Item contains no input widget");

                $basicWidgets.SelectableLookupMaintainer.removeItemWidget.call(this, selectable);
                $basicWidgets.SingleOptionInputPartial.removeItemWidget.call(this, selectable);

                return this;
            },

            /**
             * Sets input name.
             * TODO: Should come from an input-like interface (set(Input)Name, set(Input)Value)
             * @param {string} name
             * @returns {$basicWidgets.RadioGroup}
             */
            setName: function (name) {
                this.getAllDescendants()
                    .filterByType($basicWidgets.BinaryInput)
                    .callOnEachItem('setName', name);

                /** @type {string} */
                this.inputName = name;

                return this;
            },

            /**
             * Shorthand for adding a radio button with text to the group.
             * @param {string} childName
             * @param {string} radioValue
             * @param {string|$utils.Stringifiable} radioText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.RadioGroup}
             */
            addRadioButton: function (childName, radioValue, radioText, selected) {
                var labelWidget = $basicWidgets.Text.create()
                    .setContentString(radioText),
                    radioWidget = $basicWidgets.BinaryInput.create('radio')
                        .setChildName(childName)
                        .setValue(radioValue)
                        .linkLabelWidget(labelWidget);

                if (selected) {
                    radioWidget.select();
                }

                this.addItemWidget($widget.Widget.create()
                    .setChildName(childName)
                    .setTagName('li')
                    .addChild(radioWidget)
                    .addChild(labelWidget));

                return this;
            },

            /**
             * TODO: Shared w/ SingleSelect
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                $basicWidgets.SelectableLookupMaintainer
                    .onSelectableValueChange.call(this, event);
                $basicWidgets.SingleOptionInputPartial
                    .onSelectableValueChange.call(this, event);
            }
        });
});
