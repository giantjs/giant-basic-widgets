$oop.postpone(window, 'TestPage', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Page,
        self = base.extend(cn);

    /**
     * @name window.TestPage.create
     * @function
     * @returns {window.TestPage}
     */

    /**
     * Lists various widgets implemented in giant-basic-widgets.
     * @class
     * @extends $basicWidgets.Page
     */
    window.TestPage = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addPrivateMethods(/** @lends window.TestPage# */{
            //@formatter:off
/** @private */
_addPlainText: function () {
    return $basicWidgets.Text.create()
        .setContentString("<em>Hello</em>");
},

/** @private */
_addEntityBoundText: function () {
    // setting initial field value
    'user/1/name'.toField()
        .setValue("<em>Joe</em>");

    return $basicWidgets.DataText.create('user/1/name'.toFieldKey());
},

/** @private */
_addLocaleBoundText: function () {
    // initializing translations
    'locale/en-uk'.toDocument()
        .setTranslation("Hi!", ["Hi!"]);
    'locale/de-de'.toDocument()
        .setTranslation("Hi!", ["Gruß dich!"]);
    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('en-uk'.toLocale())
        .markLocaleAsReady('de-de'.toLocale());

    // setting current locale to 'de-de'
    'de-de'.toLocale().setAsCurrentLocale();

    return $basicWidgets.LocaleText.create()
        .setOriginalContentString("Hi!".toTranslatable());
},

/** @private */
_addHyperlink: function () {
    return $basicWidgets.Hyperlink.create()
        .setTargetUrl('https://http.cat')
        .addChild($basicWidgets.Text.create()
            .setContentString("HTTP Cats"));
},

/** @private */
_addDataHyperlink: function () {
    // setting entity values
    'link/1'.toDocument().setNode({
        title: 'HTTP Animals',
        url: 'https://http.cat'
    });

    return $basicWidgets.DataHyperlink.create('link/1/url'.toFieldKey())
        .addChild($basicWidgets.DataText.create('link/1/title'.toFieldKey()));
},

/** @private */
_addClickArea: function () {
    return $basicWidgets.ClickArea.create();
},

/** @private */
_addImage: function () {
    return $basicWidgets.Image.create()
        .setImageUrl('http://placekitten.com/g/512/256');
},

/** @private */
_addDataImage: function () {
    // setting entity values
    'photo/1/url'.toField().setValue('http://placekitten.com/g/512/384');

    return $basicWidgets.DataImage.create('photo/1/url'.toFieldKey());
},

/** @private */
_addList: function () {
    return $basicWidgets.List.create()
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-01')
            .setContentString("January"))
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-02')
            .setContentString("February"))
        .addItemWidget($basicWidgets.Text.create()
            .setTagName('li')
            .setChildName('month-99')
            .setContentString("and so on..."));
},

/** @private */
_addEntityList: function () {
    // constructing EntityList class
    var EntityList = $basicWidgets.List.extend('EntityList')
        .addTraitAndExtend($basicWidgets.EntityList)
        .addMethods({
            init: function (fieldKey) {
                $basicWidgets.List.init.call(this);
                $basicWidgets.EntityList.init.call(this, fieldKey);
            },
            afterAdd: function () {
                $basicWidgets.List.afterAdd.call(this);
                $basicWidgets.EntityList.afterAdd.call(this);
            },
            afterRemove: function () {
                $basicWidgets.List.afterRemove.call(this);
                $basicWidgets.EntityList.afterRemove.call(this);
            },
            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataText.create(itemKey)
                    .setTagName('li');
            },
            spawnItemName: function (itemKey) {
                return itemKey.itemId;
            }
        });

    // adding field configuration
    $entity.config.appendNode('document>field'.toPath(), {
        'week/days': { fieldType : 'collection' }
    });

    // setting collection contents
    'week/1'.toDocument().setNode({
        days: {
            '1': 'Monday',
            '2': 'Tuesday',
            '3': 'Wednesday',
            '4': 'Thursday',
            '5': 'Friday'
        }
    });

    return EntityList.create('week/1/days'.toFieldKey());
},

/** @private */
_addTextInput: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Name")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('text')
        .setName('name')
        .setValue("Fluffy")
        .setValidator(function (value) {
            return !value || value.length <= 6;
        })
        .linkLabelWidget(label);
},

/** @private */
_addDataTextInput: function (itemWidget) {
    // setting input properties
    'input/1'.toDocument().setNode({
        name: 'lives',
        value: '9'
    });

    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Lives")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.DataTextInput.create(
        'text', 'input/1/value'.toFieldKey(), 'input/1/name'.toFieldKey())
        .linkLabelWidget(label);
},

/** @private */
_addTextArea: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Description")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('textarea')
        .setName('description')
        .setValue("Fluffy Meowington's cat toys")
        .setValidator(function (value) {
            return value && value.length >= 3;
        })
        .linkLabelWidget(label);
},

/** @private */
_addEmail: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Email")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.TextInput.create('email')
        .setName('email')
        .setValue("fluffy@cats.com")
        .setValidator(function (value, inputWidget) {
            var element = inputWidget.getElement();
            return !element || element.checkValidity();
        })
        .linkLabelWidget(label);
},

/** @private */
_addSingleSelect: function (itemWidget) {
    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.SingleSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday")
        .addOption('day-02', 'tue', "Tuesday")
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label)
        .setValue('tue');
},

/** @private */
_addLocaleSingleSelect: function (itemWidget) {
    // initializing translations
    'locale/de-de'.toDocument()
        .setTranslation("Monday", ["Montag"])
        .setTranslation("Tuesday", ["Dienstag"])
        .setTranslation("Wednesday", ["Mittwoch"])
        .setTranslation("Thursday", ["Donnerstag"])
        .setTranslation("Friday", ["Freitag"])
        .setTranslation("Saturday", ["Samstag"])
        .setTranslation("Sunday", ["Sonntag"]);

    $i18n.LocaleEnvironment.create()
        .markLocaleAsReady('de-de'.toLocale());

    // setting current locale to 'de-de'
    'de-de'.toLocale().setAsCurrentLocale();

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.SingleSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addLocaleOption('day-01', 'mon', "Monday".toTranslatable())
        .addLocaleOption('day-02', 'tue', "Tuesday".toTranslatable())
        .addLocaleOption('day-03', 'wed', "Wednesday".toTranslatable())
        .addLocaleOption('day-04', 'thu', "Thursday".toTranslatable())
        .addLocaleOption('day-05', 'fri', "Friday".toTranslatable())
        .addLocaleOption('day-06', 'sat', "Saturday".toTranslatable())
        .addLocaleOption('day-07', 'sun', "Sunday".toTranslatable())
        .linkLabelWidget(label);
},

/** @private */
_addMultiSelect: function (itemWidget) {
    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.MultiSelect.create()
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday", true)
        .addOption('day-02', 'tue', "Tuesday", true)
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label);
},

/** @private */
_addDataSingleSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'single-select/options': {
            fieldType: 'collection'
        },
        'single-select/selected': {
            fieldType: 'string'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'single-select/1'.toDocument().setNode({
        options: {
            0: 'Monday',
            1: 'Tuesday',
            2: 'Wednesday',
            3: 'Thursday',
            4: 'Friday',
            5: 'Saturday',
            6: 'Sunday'
        },
        selected: '2'
    });

    return $basicWidgets.DataSingleSelect.create(
            'single-select/1/selected'.toFieldKey(),
            'single-select/1/options'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .linkLabelWidget(label);
},

/** @private */
_addHybridSingleSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'single-select/selected': {
            fieldType: 'string'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'single-select/2'.toDocument().setNode({
        selected: 'thu'
    });

    return $basicWidgets.DataSingleSelect.create(
            'single-select/2/selected'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .addOption('day-01', 'mon', "Monday")
        .addOption('day-02', 'tue', "Tuesday")
        .addOption('day-03', 'wed', "Wednesday")
        .addOption('day-04', 'thu', "Thursday")
        .addOption('day-05', 'fri', "Friday")
        .addOption('day-06', 'sat', "Saturday")
        .addOption('day-07', 'sun', "Sunday")
        .linkLabelWidget(label);
},

/** @private */
_addDataMultiSelect: function (itemWidget) {
    $entity.config.appendNode('document>field'.toPath(), {
        'multi-select/options': {
            fieldType: 'collection'
        },
        'multi-select/selected': {
            fieldType: 'collection'
        }
    });

    // creating a label for the select
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Day")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    'multi-select/1'.toDocument().setNode({
        options: {
            0: 'Monday',
            1: 'Tuesday',
            2: 'Wednesday',
            3: 'Thursday',
            4: 'Friday',
            5: 'Saturday',
            6: 'Sunday'
        },
        selected: {
            0: '0',
            2: '2'
        }
    });

    return $basicWidgets.DataMultiSelect.create(
            'multi-select/1/selected'.toFieldKey(),
            'multi-select/1/options'.toFieldKey())
        .setChildName('B-select')
        .setName('weekday')
        .linkLabelWidget(label);
},
            //@formatter:on

            /**
             * @param {function} widgetSpawner
             * @param {string|$utils.Stringifiable} hintString
             * @param {string|$utils.Stringifiable} noteString
             * @private
             */
            _addWidget: function (widgetSpawner, hintString, noteString) {
                this.getChild('widget-list')
                    .addTestItem(widgetSpawner, hintString, noteString);
            }
        })
        .addMethods(/** @lends window.TestPage# */{
            /**
             * TODO: Add data editors for databound widgets.
             * TODO: Add value editors for plain widgets.
             * TODO: Add switches to binary states.
             * @ignore
             */
            init: function () {
                base.init.call(this);

                this.elevateMethods(
                    'onClickableClick',
                    'onInputFocus',
                    'onInputBlur',
                    'onInputValueChange',
                    'onInputValidityChange',
                    'onOptionValueChange',
                    'onOptionSelectedChange',
                    'onSelectSelectionChange');

                $basicWidgets.Text.create()
                    .setTagName('h1')
                    .setContentString("Giant Basic Widgets")
                    .addToParent(this);

                TestList.create()
                    .setChildName('widget-list')
                    .addToParent(this);

                this._addWidget(
                    this._addPlainText,
                    "widgetId.toWidget().setHtmlEscaped(false)");

                this._addWidget(
                    this._addEntityBoundText,
                    "entityKey.toField().setValue('Jane')");

                this._addWidget(
                    this._addLocaleBoundText,
                    "'en-uk'.toLocale().setAsCurrentLocale()");

                this._addWidget(
                    this._addHyperlink,
                    "widgetId.toWidget().setTargetUrl('http://http.cat/200')");

                this._addWidget(
                    this._addDataHyperlink,
                    "entityKey.toField().setValue('http://httpstatusdogs.com/')");

                this._addWidget(
                    this._addClickArea,
                    "widgetId.toWidget().disableBy('foo')");

                this._addWidget(
                    this._addImage,
                    "widgetId.toWidget().setImageUrl('http://placekitten.com/g/512/320')");

                this._addWidget(
                    this._addDataImage,
                    "entityKey.toField().setValue('http://placekitten.com/g/512/320')");

                this._addWidget(
                    this._addList,
                    "widgetId.toWidget().getChild('month-02').removeFromParent()");

                this._addWidget(
                    this._addTextInput,
                    "widgetId.toWidget().setValue('foo')");

                this._addWidget(
                    this._addDataTextInput,
                    "'input/1/value'.toField().setValue('Hello World!')");

                this._addWidget(
                    this._addTextArea,
                    "widgetId.toWidget().setValue('foo')",
                    "Text Area");

                this._addWidget(
                    this._addSingleSelect,
                    "widgetId.toWidget().getOptionWidgetByValue('wed').select()");

                this._addWidget(
                    this._addLocaleSingleSelect,
                    "'en-uk'.toLocale().setAsCurrentLocale()",
                    "Locale");

                this._addWidget(
                    this._addMultiSelect,
                    "widgetId.toWidget().getOptionWidgetByValue('wed').select()");

                this._addWidget(
                    this._addDataSingleSelect,
                    "");

                this._addWidget(
                    this._addHybridSingleSelect,
                    "",
                    "Hybrid");

                this._addWidget(
                    this._addDataMultiSelect,
                    "");
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo($basicWidgets.EVENT_CLICKABLE_CLICK, this.onClickableClick)
                    .subscribeTo($basicWidgets.EVENT_INPUT_FOCUS, this.onInputFocus)
                    .subscribeTo($basicWidgets.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, this.onInputValueChange)
                    .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, this.onInputValidityChange)
                    .subscribeTo($basicWidgets.EVENT_OPTION_VALUE_CHANGE, this.onOptionValueChange)
                    .subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, this.onOptionSelectedChange)
                    .subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectSelectionChange);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onClickableClick: function (event) {
                console.info("widget clicked", event.sender.instanceId);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onInputFocus: function (event) {
                console.info("input focused", event.sender.instanceId);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onInputBlur: function (event) {
                console.info("input blurred", event.sender.instanceId);
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onInputValueChange: function (event) {
                console.info(
                    "input value changed", event.sender.instanceId,
                    "from", event.beforeValue,
                    "to", event.afterValue);
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onInputValidityChange: function (event) {
                console.info(
                    "input validity changed", event.sender.instanceId,
                    "from", !event.sender.isValid,
                    "to", event.sender.isValid);
            },

            /**
             * @param {$basicWidgets.OptionValueChangeEvent} event
             * @ignore
             */
            onOptionValueChange: function (event) {
                console.info(
                    "option value changed", event.sender.instanceId,
                    "from", event.beforeValue,
                    "to", event.afterValue);
            },

            /**
             * @param {$basicWidgets.OptionSelectedChangeEvent} event
             * @ignore
             */
            onOptionSelectedChange: function (event) {
                console.info(
                    "option selected state changed", event.sender.instanceId,
                    "from", event.wasSelected,
                    "to", event.isSelected);
            },

            /**
             * @param {$basicWidgets.SelectSelectionChangeEvent} event
             * @ignore
             */
            onSelectSelectionChange: function (event) {
                var beforeValues = event.beforeValues,
                    afterValues = event.afterValues;

                console.info(
                    "select selection changed", event.sender.instanceId,
                    "from", beforeValues.getValues(),
                    "to", afterValues.getValues());
            }
        });
});

$oop.amendPostponed($routing, 'Route', function () {
    "use strict";

    [].toRoute()
        .subscribeTo($routing.EVENT_ROUTE_CHANGE, function () {
            // activating TestPage on any route change
            TestPage.create().setAsActivePage();
        });
});
