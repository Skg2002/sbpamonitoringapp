sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/ui/model/json/JSONModel'
    ],
    function(Controller, Filter, FilterOperator, JSONModel) {
      "use strict";
  
      return Controller.extend("destinationapp.controller.Master", {
        onInit: function() {
        },

        onSearch : function (oEvent) {
          var oRefreshButton = oEvent.getParameter("refreshButtonPressed");
          var list = this.getView().byId("destlist");
          var oBinding = list.getBinding("items");
          if (oRefreshButton) {
            oBinding.refresh();
          }
          //......................
          const aFilter = [];
          const sQuery = oEvent.getParameter("query");
          if (sQuery) {
            aFilter.push(new Filter("dest_name", FilterOperator.EQ, sQuery));
          }
          oBinding.filter(aFilter);
        },

        onListItemPress : function (oEvent) {
          var oSource = oEvent.getSource();
          var oContext = oSource.getBindingContext();
          var destID = oContext.getProperty("ID");
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteDestinationView", {
            ID: window.encodeURIComponent(destID)
          });
        }
      });
    }
  );
  