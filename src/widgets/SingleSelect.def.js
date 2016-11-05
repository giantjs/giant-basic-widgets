$oop.postpone($basicWidgets, 'SingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.SelectableLookupMaintainer)
            .addTraitAndExtend($basicWidgets.SingleOptionInputPartial)
            .addTrait($basicWidgets.SelectPartial)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable');

    /**
     * @name $basicWidgets.SingleSelect.create
     * @function
     * @returns {$basicWidgets.SingleSelect}
     */

    /**
     * Dom-native select dropdown.
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.SelectableLookupMaintainer
     * @extends $basicWidgets.SingleOptionInputPartial
     * @extends $basicWidgets.SelectPartial
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomInputable
     */
    $basicWidgets.SingleSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.SingleSelect# */{
            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @private
             */
            _valueGetterProxy: function (element) {
                return element.value;
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {HTMLSelectElement} element
             * @returns {HTMLCollection}
             * @private
             */
            _selectedOptionsGetterProxy: function (element) {
                return element.selectedOptions;
            }
        })
        .addMethods(/** @lends $basicWidgets.SingleSelect# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.SelectableLookupMaintainer.init.call(this);
                $basicWidgets.SingleOptionInputPartial.init.call(this);
                $basicWidgets.SelectPartial.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethod('onChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.SelectableLookupMaintainer.afterAdd.call(this);
                $basicWidgets.SingleOptionInputPartial.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SingleSelect}
             */
            addItemWidget: function (itemWidget) {
                base.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectPartial.addItemWidget.call(this, itemWidget);
                $basicWidgets.SingleOptionInputPartial.addItemWidget.call(this, itemWidget);
                return this;
            },

            /**
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.SingleSelect}
             */
            removeItemWidget: function (itemWidget) {
                base.removeItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.removeItemWidget.call(this, itemWidget);
                $basicWidgets.SingleOptionInputPartial.removeItemWidget.call(this, itemWidget);
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);

                var selectedOptionElements = this._selectedOptionsGetterProxy(this.getElement()),
                    selectedOptionElement = selectedOptionElements[0],
                    selectedValueBefore = this.selectedValue,
                    selectedValueAfter = selectedOptionElement && this._valueGetterProxy(selectedOptionElement);

                if (selectedValueAfter !== selectedValueBefore) {
                    // deselecting current option
                    if (selectedValueBefore) {
                        this.getItemWidgetByValue(selectedValueBefore).deselect();
                    }

                    // selecting new option
                    if (selectedValueAfter) {
                        this.getItemWidgetByValue(selectedValueAfter).select();
                    }
                }

                link.unlink();
            },

            /**
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
