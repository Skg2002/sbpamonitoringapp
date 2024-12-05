sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel","sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
    
], function (Controller,JSONModel,MessageToast,DateFormat) {
    "use strict";

    return Controller.extend("automationhealthapp.controller.Automationdetail", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Automationdetail").attachPatternMatched(this.onObjectMatched, this);
        
            const savedData = localStorage.getItem("detailModelData");
            if (savedData) {
                const parsedData = JSON.parse(savedData);

                const detailModel = new JSONModel(parsedData);
                this.getOwnerComponent().setModel(detailModel, "detailModel");
                this._originalData = detailModel.getProperty("/data");

                this.byId("startText").setText(parsedData.startDate);
                this.byId("endText").setText(parsedData.endDate);

                this.updateTableColumns();
            }
        },
        
        onObjectMatched: function (oEvent) {
            const automationPath = decodeURIComponent(oEvent.getParameter("arguments").automationPath);
            const tenant = oEvent.getParameter("arguments").tenant;
            const status = oEvent.getParameter("arguments").status;

            const relatedDataModel = this.getOwnerComponent().getModel("relatedDataModel");
            const relatedData = relatedDataModel.getProperty("/relatedData");
            const oStartDate = relatedDataModel.getProperty("/startDate");
            const oEndDate = relatedDataModel.getProperty("/endDate");

            const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MMMM dd, yyyy HH:mm" });
            const formattedStartDate = oDateFormat.format(new Date(oStartDate));
            const formattedEndDate = oDateFormat.format(new Date(oEndDate));

            this.byId("startText").setText(formattedStartDate);
            this.byId("endText").setText(formattedEndDate);

            var itemCount = 0

            if (relatedData) {
                const processNames = [];
                const automationNames = [];
                const tenantsNames = [];

                relatedData.forEach((item) => {
                    item.formattedStartTime = item.startTime ? new Intl.DateTimeFormat('en-US', {
                        month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
                    }).format(new Date(item.startTime)) : "N/A";

                    if (item.processSubjectName && !processNames.includes(item.processSubjectName)) {
                        processNames.push(item.processSubjectName);
                    }
                    if (item.automationName && !automationNames.includes(item.automationName)) {
                        automationNames.push(item.automationName);
                    }
                    if (item.tenant && !tenantsNames.includes(item.tenant)) {
                        tenantsNames.push(item.tenant);
                    }
                });
                itemCount = relatedData.length;
                const detailModel = new JSONModel({
                    data: relatedData,
                    status: status,
                    itemCount: itemCount,
                    processNames: processNames,
                    automationNames: automationNames,
                    tenantsNames: tenantsNames
                });
                this.getOwnerComponent().setModel(detailModel, "detailModel");
                this._originalData = detailModel.getProperty("/data");
                this.updateTableColumns();
                localStorage.setItem(
                    "detailModelData",
                    JSON.stringify({
                        data: detailModel.getProperty("/data"),
                        itemCount: itemCount,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        processNames: processNames,
                        automationNames: automationNames,
                        tenantsNames: tenantsNames,
                    })
                );
            }
        },
        onProcessSelectionChange: function (oEvent) {
            this.filterData();
        },
                
        onAutomationSelectionChange: function (oEvent) {
            this.filterData();
        },
        onTenantSelectionChange: function(oEvent){
            this.filterData();
        },

        filterData: function () {
            const detailModel = this.getOwnerComponent().getModel("detailModel");

            const allData = this._originalData;

            const processKeys = this.getView().byId("processNamesComboBox").getSelectedKeys();
            const automationKeys = this.getView().byId("automationNamesComboBox").getSelectedKeys();
            // const tenantKeys = this.getView().byId("tenantNamesComboBox").getSelectedKeys();
        
            const filteredData = allData.filter(item =>
                (processKeys.length === 0 || processKeys.includes(item.processSubjectName)) &&
                (automationKeys.length === 0 || automationKeys.includes(item.automationName)) 
                                // (tenantKeys.length === 0 || tenantKeys.includes(item.tenant))
            );
            detailModel.setProperty("/data", filteredData);
            detailModel.setProperty("/itemCount", filteredData.length);
        },
        updateTableColumns: function () {
            const oTable = this.byId("idTable");
            const oModel = this.getOwnerComponent().getModel("detailModel");
        
            if (!oModel) {
                console.error("Model 'detailModel' is not available");
                return;
            }
        
            const aData = oModel.getProperty("/data");
            if (!Array.isArray(aData)) {
                console.error("Data in 'detailModel' is not an array or is undefined");
                return;
            }

            const bShowErrorMessageColumn = aData.some(item => 
                item.status !== "Completed" && item.status !== "In Progress"
            );
        
            const oErrorMessageColumn = oTable.getColumns().find(column => 
                column.getHeader().getText() === "Error Message"
            );
            if (oErrorMessageColumn) {
                oErrorMessageColumn.setVisible(bShowErrorMessageColumn);
            }

            const bDisableDurationColumn = aData.some(item => item.status === "In Progress");
        
            const oDurationColumn = oTable.getColumns().find(column => 
                column.getHeader().getText() === "Duration"
            );
            if (oDurationColumn) {
                oDurationColumn.setVisible(!bDisableDurationColumn);
            }
        },

        onDownload: function () {
            var oModel = this.getView().getModel("detailModel");
            var aData = oModel.getProperty("/data"); 

            const aExportData = aData.map(item => ({
                "Automation Name": item.automationName,
                "Process Name": item.processSubjectName,
                "Start Time": item.formattedStartTime,
                "Duration (in Sec)": item.duration,
                "Error Message": item.errorMessage,
                Status: item.status,
            }));

            var aFilteredData = aExportData.map(function (oData) {
                var oClonedData = Object.assign({}, oData);

                if (oClonedData.Status === "Completed") {
                    delete oClonedData["Error Message"];

                } else if (oClonedData.Status === "In Progress") {
                    delete oClonedData["Duration (in Sec)"];
                    delete oClonedData["Error Message"];
                }

                return oClonedData;
            });

            var ws = XLSX.utils.json_to_sheet(aFilteredData);

            var colWidths = [];
            ws["!cols"] = Object.keys(ws).reduce(function (acc, key) {
                var col = ws[key];
                if (col.v) {
                    var colWidth = col.v.toString().length;
                    acc.push({ wpx: colWidth * 10}); 
                }
                return acc;
            }, []);

            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Automation_Details");

            var oStartText = this.byId("startText");
            var sStartDate = oStartText.getText(); 

            var oEndText = this.byId("endText");
            var sEndDate = oEndText.getText();

            var sFormattedStartDate = "";
            var sFormattedEndDate = "";

            if (sStartDate) {
                var oStartDate = new Date(sStartDate);
                var iStartMonth = oStartDate.getMonth() + 1;
                var sStartMonth = iStartMonth < 10 ? "0" + iStartMonth : iStartMonth;
                var sStartDay = oStartDate.getDate() < 10 ? "0" + oStartDate.getDate() : oStartDate.getDate();
                var sStartYear = oStartDate.getFullYear();
                sFormattedStartDate = sStartYear + "-" + sStartMonth + "-" + sStartDay;
            }

            if (sEndDate) {
                var oEndDate = new Date(sEndDate);
                var iEndMonth = oEndDate.getMonth() + 1;
                var sEndMonth = iEndMonth < 10 ? "0" + iEndMonth : iEndMonth;
                var sEndDay = oEndDate.getDate() < 10 ? "0" + oEndDate.getDate() : oEndDate.getDate();
                var sEndYear = oEndDate.getFullYear();
                sFormattedEndDate = sEndYear + "-" + sEndMonth + "-" + sEndDay;
            }

            var status = aData[0] && aData[0].status; 
            var filenamePrefix = "Automation_";
            
            if (status === "Completed") {
                filenamePrefix += "Completed";
            } else if (status === "In Progress") {
                filenamePrefix += "OnGoing";
            } else if (status === "Failed") {
                filenamePrefix += "Failed";
            } else {
                filenamePrefix += "Other";
            }

            if (sFormattedStartDate && sFormattedEndDate) {
                filenamePrefix += " (" +sFormattedStartDate + " to " + sFormattedEndDate+ ")";
            } else if (sFormattedStartDate) {
                filenamePrefix += "_" + sFormattedStartDate;
            } else if (sFormattedEndDate) {
                filenamePrefix += "_" + sFormattedEndDate;
            }

            filenamePrefix += ".xlsx";

            XLSX.writeFile(wb, filenamePrefix);
            sap.m.MessageToast.show("Autmanation Data downloaded successfully");
        },
    });
});

