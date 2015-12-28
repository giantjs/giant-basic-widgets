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
        .setTranslations({
            "Hi!": "Hi!"
        });
    'locale/de-de'.toDocument()
        .setTranslations({
            "Hi!": "Gruß dich!"
        });
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
_addButton: function () {
    return $basicWidgets.Button.create();
},

/** @private */
_addImage: function () {
    return $basicWidgets.Image.create()
        .setImageUrl('http://httpcats.herokuapp.com/418');
},

/** @private */
_addDataImage: function () {
    // setting entity values
    'photo/1/url'.toField().setValue('http://httpcats.herokuapp.com/417');

    return $basicWidgets.DataImage.create('photo/1/url'.toFieldKey());
},

/** @private */
_addTextInput: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('A-label')
        .setContentString("Name")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.DirectInput.create()
        .linkLabelWidget(label);
},

/** @private */
_addCheckboxInput: function (itemWidget) {
    // creating a label for the input
    var label = $basicWidgets.Text.create()
        .setChildName('z-label')
        .setContentString("Meows")
        .setContainerCssClass('widget-container')
        .addToParent(itemWidget);

    return $basicWidgets.BinaryInput.create('checkbox')
        .linkLabelWidget(label);
},
            //@formatter:on

            /**
             * @param {function} widgetSpawner
             * @param {string|$utils.Stringifiable} hintString
             * @private
             */
            _addWidget: function (widgetSpawner, hintString) {
                this.getChild('widget-list')
                    .addTestItem(widgetSpawner, hintString);
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
                    'onButtonClick',
                    'onInputFocus',
                    'onInputBlur',
                    'onInputStateChange');

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
                    "widgetId.toWidget().setTargetUrl('https://http.cat/200')");

                this._addWidget(
                    this._addDataHyperlink,
                    "entityKey.toField().setValue('http://httpstatusdogs.com/')");

                this._addWidget(
                    this._addButton,
                    "widgetId.toWidget().disableBy('foo')");

                this._addWidget(
                    this._addImage,
                    "widgetId.toWidget().setImageUrl('http://httpcats.herokuapp.com/404')");

                this._addWidget(
                    this._addDataImage,
                    "entityKey.toField().setValue('http://httpcats.herokuapp.com/305')");

                this._addWidget(
                    this._addTextInput,
                    "widgetId.toWidget().setInputValue('foo')");

                this._addWidget(
                    this._addCheckboxInput,
                    "widgetId.toWidget().setInputValue('checked')");
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo($basicWidgets.EVENT_BUTTON_CLICK, this.onButtonClick)
                    .subscribeTo($basicWidgets.EVENT_INPUT_FOCUS, this.onInputFocus)
                    .subscribeTo($basicWidgets.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, this.onInputStateChange);
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onButtonClick: function (event) {
                console.info("button clicked", event.sender.instanceId);
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
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onInputStateChange: function (event) {
                console.info("input state changed", event.sender.instanceId);
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
