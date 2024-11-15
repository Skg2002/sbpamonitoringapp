sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "../model/formatter"
],
function (Controller, JSONModel, Filter, FilterOperator, formatter) {
    "use strict";
    
    return Controller.extend("deletedinstanceslogsapp.controller.LogsView", {
        formatter: formatter,
        onInit: function () {
            var oModel = new JSONModel();
            this.getView().setModel(oModel,"appModel");
            this.onRead()
        },

        onRead: function () {
            // var oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, parseInt(destID));
            var oListBinding = this.getOwnerComponent().getModel().bindList("/DeletedInstances", undefined, undefined, undefined, undefined);  //params : sPath, oContext?, vSorters?, vFilters?, mParameters?
              
               oListBinding.requestContexts(0,99999).then((aContexts)=>{
                   var aData = aContexts.map((oContext)=>oContext.getObject());
                   if(aData && aData.length > 0){   
                    const filterSubjects = aData.filter((item, index, self) =>
                        index === self.findIndex((t) => t.subject === item.subject)
                    );
                    this.getView().getModel("appModel").setProperty("/FilteredSubjects", filterSubjects);
                   }
               }).catch((oErr)=>{
               });
        },

        onSubjectChanged : function (oEvent) {
            // var oRefreshButton = oEvent.getParameter("refreshButtonPressed");
            var oTable = this.getView().byId("instanceLogsTable");
            var oBinding = oTable.getBinding("items");
            // if (oRefreshButton) {
            //   oBinding.refresh();
            // }
            //......................
            const aFilter = [];
            const sQuery = oEvent.getSource().getValue();
            if (sQuery) {
              aFilter.push(new Filter("subject", FilterOperator.Contains, sQuery));
            }
            oBinding.filter(aFilter);
        },
    });
});
