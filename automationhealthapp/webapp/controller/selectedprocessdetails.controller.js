sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Popover",
    "sap/m/Text",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/m/Token",
    "../model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Fragment, List, StandardListItem, Popover,Text,ChartFormatter,Token,formatter,Sorter,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("automationhealthapp.controller.selectedprocessdetails", {
        formatter:formatter,
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("selectedprocessdetails").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var tenants = oArgs.Tenant;
        var ids = oArgs.IDs // Retrieve username parameter
        this.loadData(tenants, ids);
},

// loadData: function (tenants, ids) { // Receive tenants and ids as parameters
//     let that = this;

//     // Open busy dialog if required
//     this.getOwnerComponent().openBusyDialog();

//     let oModel = this.getOwnerComponent().getModel("wfModel");

//     // Bind the list with tenants and ids
//     let oListBinding = oModel.bindList(`/fetchWorkFlowById(tenants='${tenants}',ids='${ids}')`);
//     oListBinding.requestContexts(0, 99999).then((aContexts) => {
//                 this.fetchedData = aContexts.flatMap((ctx) => ctx.getObject().data);


//                 // this.fetchedIdsString = this.fetchedData.map(instance => instance.id).join('%2C');
//                 // this.analyzeAutomation(that, tenants, this.fetchedIdsString);

//                 // let oGroupedData = that.groupByTenant(this.fetchedData);
//                 // let { allIds, erroneousIds } = that.getAllIdsByTenant(oGroupedData);

              
                
//                 that.getOwnerComponent().closeBusyDialog();
//             }).catch((error) => {
//                 console.error("Error retrieving workflow instances:", error);
//                 that.getOwnerComponent().closeBusyDialog();
//             });
//         }


loadData: function (tenants, ids) {
    let that = this;
    this.getOwnerComponent().openBusyDialog();

    let oModel = this.getOwnerComponent().getModel("wfModel");
    console.log("Tenants:", tenants, "IDs:", ids); // Log parameters

    let oListBinding = oModel.bindList(`/fetchWorkFlowById(tenants='${tenants}',ids='${ids}')`);
    oListBinding.requestContexts(0, 99999).then((aContexts) => {
        console.log("Raw Contexts:", aContexts);

        // Check if any context is returned
        if (!aContexts || aContexts.length === 0) {
            console.warn("No contexts returned by the service.");
            this.fetchedData = [];
            this.updateTableModel([]); // Update the model with empty data
            that.getOwnerComponent().closeBusyDialog();
            return;
        }

        // Extract and process data
        this.fetchedData = aContexts.flatMap((ctx) => {
            let instance = ctx.getObject();
            console.log("Instance Data:", instance); // Log the full instance

            // Check if workflows exist and have valid data
            if (!instance || !instance.workflows || instance.workflows.length === 0) {
                console.warn("Invalid or empty workflows in instance:", instance);
                return [];
            }

            // Extract `data` from each workflow
            return instance.workflows.flatMap((workflow) => {
                if (!workflow.data) {
                    console.warn("Invalid or empty data in workflow:", workflow);
                    return [];
                }

                // Add tenant info and return the single `data` object
                return {
                    ...workflow.data,
                    tenant: instance.tenant // Add tenant info to the object
                };
            });
        });

        console.log("Fetched Data:", this.fetchedData);

        // Update the table model with the fetched data
        this.updateTableModel(this.fetchedData);

        that.getOwnerComponent().closeBusyDialog();

    }).catch((error) => {
        console.error("Error retrieving workflow instances:", error);
        that.updateTableModel([]); // Update the model with empty data
        that.getOwnerComponent().closeBusyDialog();
    });
},

updateTableModel: function (data) {
    // Create or update the JSON model for the table
    let oTableModel = this.getView().getModel("tableModel");

    if (!oTableModel) {
        // Create a new model if it doesn't exist
        oTableModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oTableModel, "tableModel");
    }

    // Set the data to the model
    oTableModel.setData({ workflows: data });
},

onSortToggle: function (oEvent) {
    var oView = this.getView();
    var oIcon = this.getView().byId("sortIcons"); 
    if (oIcon) {
        this._bDescendingSort = !this._bDescendingSort;

        if (this._bDescendingSort) {
            oIcon.setSrc("sap-icon://sort-descending");
        } else {
            oIcon.setSrc("sap-icon://sort-ascending");
        }

        var oTable =this.getView().byId("idProcessTables");
        var oBinding = oTable.getBinding("items");
        var oSorter = new Sorter("startedAt", this._bDescendingSort);
        oBinding.sort(oSorter);
    } else {
        console.error("Sort icon not found");
    }
},

    onSearch(oEvent){
        const aFilter = [];
            const sQuery = oEvent.getParameter("query");
            if (sQuery) {
             aFilter.push(new Filter("subject", FilterOperator.Contains, sQuery)); 
            }

            // filter binding
            const oTable = this.byId("idProcessTables");
            // const oList =  sap.ui.getCore().byId("container-workflowmonitoring---Master--Fragment2Page--idProductsTable")
            const oBinding = oTable.getBinding("items");  
            oBinding.filter(aFilter);

            var nameLengthFilter = new sap.ui.model.Filter({
                path: 'subject',
                value1: sQuery,
                operator: sap.ui.model.FilterOperator.Contains
            });
            
            oBinding.filter(nameLengthFilter);

    },
    onSelectionChange : function (oEvent) {
        // this.loadInstances(oEvent);
        var aSelectedKeys = this.byId("StatusMultiComboBox").getSelectedKeys();

            // Get the binding of the table items
            var oTable = this.byId("idProcessTables");
            var oBinding = oTable.getBinding("items");
            
            // Create a filter for the selected statuses
            var aFilters = [];
            if (aSelectedKeys.length > 0) {
                aSelectedKeys.forEach(function (sStatus) {
                    aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sStatus));
                });
           }

        // Apply the filter to the table
        oBinding.filter(aFilters, "Application");
            }


    });
            
});    

