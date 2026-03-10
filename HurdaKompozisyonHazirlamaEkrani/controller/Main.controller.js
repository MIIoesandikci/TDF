sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "sap/ui/core/Fragment"],
    function (Controller, JSONModel, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("HurdaKompozisyonHazirlamaEkrani.controller.Main", {
            onInit: function () {
                var that = this;
                var oI18nModel = this.getView().getModel("i18n").getResourceBundle();

                this._initializeData(oI18nModel);
            },

            _initializeData: function (oI18nModel) {
                var oBundle = oI18nModel ? oI18nModel : null;
                const oData = {
                    disaList: [
                        { key: "DISA1", text: "DISA 1" },
                        { key: "DISA2", text: "DISA 2" },
                    ],
                    ergitmeList: [
                        { key: "1A", text: oBundle ? oBundle.getText("furnace_1a") : "Ocak 1A", disa: "DISA1" },
                        { key: "1B", text: oBundle ? oBundle.getText("furnace_1b") : "Ocak 1B", disa: "DISA1" },
                        { key: "2A", text: oBundle ? oBundle.getText("furnace_2a") : "Ocak 2A", disa: "DISA2" },
                        { key: "2B", text: oBundle ? oBundle.getText("furnace_2b") : "Ocak 2B", disa: "DISA2" },
                    ],
                    filteredErgitmeList: [],
                    filteredErgitmeListC: [],
                    malzemeList: [
                        {
                            kodu: "HURDA-1",
                            aciklama: oBundle ? oBundle.getText("material_desc_1") : "Hurda Malzeme 1",
                            birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                        },
                        {
                            kodu: "HURDA-2",
                            aciklama: oBundle ? oBundle.getText("material_desc_2") : "Hurda Malzeme 2",
                            birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                        },
                        {
                            kodu: "HURDA-3",
                            aciklama: oBundle ? oBundle.getText("material_desc_3") : "Hurda Malzeme 3",
                            birim: oBundle ? oBundle.getText("unit_ton") : "TON",
                        },
                        {
                            kodu: "HURDA-4",
                            aciklama: oBundle ? oBundle.getText("material_desc_4") : "Hurda Malzeme 4",
                            birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                        },
                    ],
                    panelA: {
                        disaIsYeri: "",
                        ergitmeOcagi: "",
                        sira: "",
                        malzemeKodu: "",
                        birim: oBundle ? oBundle.getText("panelA_birim_auto") : "Malzeme seçimiyle otomatik dolacak",
                        planliMiktar: "",
                    },
                    panelC: {
                        disaIsYeri: "",
                        ergitmeOcagi: "",
                        toplamMiktar: "0",
                        tableData: [],
                    },
                    panelB: {
                        tableData: [
                            {
                                ergitmeOcagi: "1A",
                                sira: "1",
                                malzemeKodu: "HURDA-1",
                                aciklama: oBundle ? oBundle.getText("material_desc_1") : "Hurda Malzeme 1",
                                planliMiktar: "2000",
                                birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                                kullanici: "ALI_YILMAZ",
                            },
                            {
                                ergitmeOcagi: "1A",
                                sira: "2",
                                malzemeKodu: "HURDA-2",
                                aciklama: oBundle ? oBundle.getText("material_desc_2") : "Hurda Malzeme 2",
                                planliMiktar: "1500",
                                birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                                kullanici: "VA_YILMAZ",
                            },
                            {
                                ergitmeOcagi: "1A",
                                sira: "3",
                                malzemeKodu: "HURDA-3",
                                aciklama: oBundle ? oBundle.getText("material_desc_3") : "Hurda Malzeme 3",
                                planliMiktar: "1000",
                                birim: oBundle ? oBundle.getText("unit_kg") : "KG",
                                kullanici: "ALI_YILMAZ",
                            },
                        ],
                    },
                };

                const oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "viewModel");
            },

            onDisaListSelectChange: function () {
                var oModel = this.getView().getModel("viewModel");
                var sSelectedDisa = oModel.getProperty("/panelA/disaIsYeri");
                var aErgitmeList = oModel.getProperty("/ergitmeList");

                var aFiltered = aErgitmeList.filter(function (item) {
                    return item.disa === sSelectedDisa;
                });
                oModel.setProperty("/filteredErgitmeList", aFiltered);

                oModel.setProperty("/panelA/ergitmeOcagi", "");
                oModel.setProperty("/panelA/sira", "");
            },

            onFilteredErgitmeListSelectChange: function () {
                var oModel = this.getView().getModel("viewModel");
                var sSelectedErgitme = oModel.getProperty("/panelA/ergitmeOcagi");

                if (!sSelectedErgitme) {
                    oModel.setProperty("/panelA/sira", "");
                    return;
                }

                var aTableData = oModel.getProperty("/panelB/tableData") || [];
                var maxSira = 0;

                aTableData.forEach(function (item) {
                    if (item.ergitmeOcagi === sSelectedErgitme) {
                        var currentSira = parseInt(item.sira, 10);
                        if (!isNaN(currentSira) && currentSira > maxSira) {
                            maxSira = currentSira;
                        }
                    }
                });

                oModel.setProperty("/panelA/sira", (maxSira + 1).toString());
            },

            onMaterialListComboBoxChange: function () {
                var oModel = this.getView().getModel("viewModel");
                var sMalzemeKodu = oModel.getProperty("/panelA/malzemeKodu");
                var aMalzemeList = oModel.getProperty("/malzemeList");

                var oSelectedMalzeme = aMalzemeList.find(function (m) {
                    return m.kodu === sMalzemeKodu;
                });

                if (oSelectedMalzeme) {
                    oModel.setProperty("/panelA/birim", oSelectedMalzeme.birim);
                } else {
                    oModel.setProperty(
                        "/panelA/birim",
                        this.getView().getModel("i18n").getResourceBundle().getText("panelA_birim_auto"),
                    );
                }
            },

            onPlannedAmountInputLiveChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oEvent.getParameter("value");

                // Sadece rakam ve ondalık noktaya izin ver (harfleri ve eksi işaretini temizle)
                var sNewValue = sValue.replace(/[^\d.]/g, "");

                // Eğer birden fazla nokta girildiyse, ilk noktadan sonrakileri temizle
                var aParts = sNewValue.split(".");
                if (aParts.length > 2) {
                    sNewValue = aParts[0] + "." + aParts.slice(1).join("");
                }

                if (sValue !== sNewValue) {
                    oInput.setValue(sNewValue);
                    var oValueBinding = oInput.getBinding("value");
                    if (oValueBinding) {
                        oValueBinding.getModel().setProperty(oValueBinding.getPath(), sNewValue);
                    }
                }
            },

            _updatePanelC: function () {
                var oModel = this.getView().getModel("viewModel");
                var sSelectedErgitmeC = oModel.getProperty("/panelC/ergitmeOcagi");

                if (!sSelectedErgitmeC) {
                    oModel.setProperty("/panelC/tableData", []);
                    oModel.setProperty("/panelC/toplamMiktar", "0");
                    return;
                }

                var aAllTableData = oModel.getProperty("/panelB/tableData") || [];

                // Seçilen ocağa ait malzemeleri filtrele
                var aFilteredForC = aAllTableData.filter(function (item) {
                    return item.ergitmeOcagi === sSelectedErgitmeC;
                });

                // Sıra numarasına göre büyükten küçüğe sırala (1 en altta olacak şekilde)
                aFilteredForC.sort(function (a, b) {
                    return parseInt(b.sira, 10) - parseInt(a.sira, 10);
                });

                // Toplam miktarı hesapla
                var nTotal = aFilteredForC.reduce(function (sum, item) {
                    var val = parseFloat(item.planliMiktar);
                    return sum + (isNaN(val) ? 0 : val);
                }, 0);

                oModel.setProperty(
                    "/panelC/tableData",
                    aFilteredForC.map(function (item) {
                        // Panel C tablosunda görünmesi istenen alanlar
                        return {
                            sira: item.sira,
                            malzemeAciklamasi: item.aciklama || item.malzemeKodu,
                            planliMiktar: item.planliMiktar,
                            birim: item.birim,
                        };
                    }),
                );

                oModel.setProperty("/panelC/toplamMiktar", nTotal.toString());
            },

            onDisaListSelectPanelCChange: function () {
                var oModel = this.getView().getModel("viewModel");
                var sSelectedDisaC = oModel.getProperty("/panelC/disaIsYeri");
                var aErgitmeList = oModel.getProperty("/ergitmeList");

                var aFilteredC = aErgitmeList.filter(function (item) {
                    return item.disa === sSelectedDisaC;
                });
                oModel.setProperty("/filteredErgitmeListC", aFilteredC);

                oModel.setProperty("/panelC/ergitmeOcagi", "");
                this._updatePanelC();
            },

            onFilteredErgitmeListCSelectChange: function () {
                this._updatePanelC();
            },

            onSaveButtonPress: function () {
                var oModel = this.getView().getModel("viewModel");
                var oPanelA = oModel.getProperty("/panelA");

                // DISA İş Yeri veya Ergitme Ocağı seçilmeden kayıt atılamaz
                if (!oPanelA.disaIsYeri || !oPanelA.ergitmeOcagi) {
                    MessageToast.show(
                        this.getView().getModel("i18n").getResourceBundle().getText("msg_selectDisaAndFurnaceRequired"),
                    );
                    return;
                }

                // Malzeme kodunun da seçilmiş olması genelde beklenir
                if (!oPanelA.malzemeKodu) {
                    MessageToast.show(
                        this.getView().getModel("i18n").getResourceBundle().getText("msg_selectMaterialToAdd"),
                    );
                    return;
                }

                // Planlı miktar boş veya sıfır girilemez
                var parseFloatMiktar = parseFloat(oPanelA.planliMiktar);
                if (!oPanelA.planliMiktar || isNaN(parseFloatMiktar) || parseFloatMiktar <= 0) {
                    MessageToast.show(
                        this.getView().getModel("i18n").getResourceBundle().getText("msg_invalidPlannedAmountWithZero"),
                    );
                    return;
                }

                var aTableData = oModel.getProperty("/panelB/tableData") || [];

                // Aynı ocak için aynı sıra numarası ile ikinci bir kayıt oluşturulamaz
                var bSiraExists = aTableData.some(function (item) {
                    return item.ergitmeOcagi === oPanelA.ergitmeOcagi && item.sira === oPanelA.sira;
                });

                if (bSiraExists) {
                    MessageToast.show(
                        this.getView()
                            .getModel("i18n")
                            .getResourceBundle()
                            .getText("msg_duplicateOrderForFurnace", [oPanelA.sira]),
                    );
                    return;
                }

                var aMalzemeList = oModel.getProperty("/malzemeList");
                var oSelectedMalzeme = aMalzemeList.find(function (m) {
                    return m.kodu === oPanelA.malzemeKodu;
                });

                var newItem = {
                    ergitmeOcagi: oPanelA.ergitmeOcagi,
                    sira: oPanelA.sira,
                    malzemeKodu: oPanelA.malzemeKodu,
                    aciklama: oSelectedMalzeme ? oSelectedMalzeme.aciklama : "",
                    planliMiktar: oPanelA.planliMiktar,
                    birim: oPanelA.birim,
                    kullanici: "KULLANICI_1",
                };

                aTableData.push(newItem);
                oModel.setProperty("/panelB/tableData", aTableData);

                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("msg_materialAdded"));

                // B tablosu güncellendi, eğer Panel C'de aynı ocak seçiliyse orası da güncellensin
                this._updatePanelC();

                oModel.setProperty("/panelA/sira", (parseInt(oPanelA.sira, 10) + 1).toString());
                oModel.setProperty("/panelA/malzemeKodu", "");
                oModel.setProperty(
                    "/panelA/birim",
                    this.getView().getModel("i18n").getResourceBundle().getText("panelA_birim_auto"),
                );
                oModel.setProperty("/panelA/planliMiktar", "");
            },

            onEditButtonPress: function () {
                var oTable = this.byId("idTableDataPanelBTable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("msg_selectRecordToEdit"));
                    return;
                }

                var sPath = oSelectedItem.getBindingContext("viewModel").getPath();
                var oModel = this.getView().getModel("viewModel");
                var oRowData = oModel.getProperty(sPath);

                // Seçilen satırın kopyasını oluştur (İptal'e basılırsa asıl veri bozulmasın diye)
                var oEditData = Object.assign({}, oRowData);
                this._sEditPath = sPath; // Kaydet butonunda kullanmak için path'i sakla

                var oView = this.getView();
                if (!this._oEditDialog) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "HurdaKompozisyonHazirlamaEkrani.view.fragment.EditDialog",
                        controller: this,
                    }).then(
                        function (oDialog) {
                            this._oEditDialog = oDialog;
                            oView.addDependent(this._oEditDialog);
                            var oEditModel = new JSONModel(oEditData);
                            this._oEditDialog.setModel(oEditModel, "editModel");
                            this._oEditDialog.open();
                        }.bind(this),
                    );
                } else {
                    var oEditModel = new JSONModel(oEditData);
                    this._oEditDialog.setModel(oEditModel, "editModel");
                    this._oEditDialog.open();
                }
            },

            onEditDialogSaveButtonPress: function () {
                var oEditModel = this._oEditDialog.getModel("editModel");
                var oEditData = oEditModel.getData();

                if (!oEditData.malzemeKodu) {
                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("msg_selectMaterial"));
                    return;
                }

                var parseFloatMiktar = parseFloat(oEditData.planliMiktar);
                if (!oEditData.planliMiktar || isNaN(parseFloatMiktar) || parseFloatMiktar <= 0) {
                    MessageToast.show(
                        this.getView().getModel("i18n").getResourceBundle().getText("msg_invalidPlannedAmount"),
                    );
                    return;
                }

                var oViewModel = this.getView().getModel("viewModel");
                var aMalzemeList = oViewModel.getProperty("/malzemeList");
                var oSelectedMalzeme = aMalzemeList.find(function (m) {
                    return m.kodu === oEditData.malzemeKodu;
                });

                if (oSelectedMalzeme) {
                    oEditData.aciklama = oSelectedMalzeme.aciklama;
                    oEditData.birim = oSelectedMalzeme.birim;
                }

                // Ana modeli güncelle
                oViewModel.setProperty(this._sEditPath, oEditData);

                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("msg_recordUpdated"));
                this._updatePanelC();
                this._oEditDialog.close();
            },

            onEditDialogCancelButtonPress: function () {
                this._oEditDialog.close();
            },

            onDeleteButtonPress: function () {
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("msg_deletePressed"));
            },
        });
    },
);
