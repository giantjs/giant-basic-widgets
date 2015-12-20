$oop.postpone($basicWidgets, 'Application', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * Creates a Application instance.
     * @name $basicWidgets.Application.create
     * @function
     * @returns {$basicWidgets.Application}
     */

    /**
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Application = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends $basicWidgets.Application# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                // setting widget as root
                this.setRootWidget();
            }
        });
});
