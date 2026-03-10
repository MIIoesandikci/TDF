sap.ui.define(
    ["sap/ui/core/UIComponent", "sap/ui/Device", "HurdaKompozisyonHazirlamaEkrani/model/models"],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("HurdaKompozisyonHazirlamaEkrani.Component", {
            metadata: {
                manifest: "json",
            },

            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // // enable routing
                //this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                document.title = this.getModel("i18n").getResourceBundle().getText("title");
            },

            getContentDensityClass: function () {
                if (!this._sContentDensityClass) {
                    if (!Device.support.touch) {
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            },
        });
    },
);
