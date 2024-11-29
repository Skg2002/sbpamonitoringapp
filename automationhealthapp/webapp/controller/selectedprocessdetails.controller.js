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
	"sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet"
], function (Controller, JSONModel, Fragment, List, StandardListItem, Popover,Text,ChartFormatter,Token,formatter,Sorter,Filter,FilterOperator,Spreadsheet) {
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

        var oTitle = this.getView().byId("dynamicPageTitle");
     if (oTitle) {
                 oTitle.setText("Process Details Of " + tenants); 
              }

    //  var oView = this.getView();
    // var oTableTitle = oView.byId("tableTitle");  // Access the Table Title control by ID
    // if (oTableTitle) {
    //     // Update the Table Title text dynamically
    //     oTableTitle.setText(`Items of ${tenants} (${this.fetchedData ? this.fetchedData.length : 0})`);
    // }
},




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





// loadData: function (tenants, ids) {
//     let that = this;
//     this.getOwnerComponent().openBusyDialog();

//     let oModel = this.getOwnerComponent().getModel("wfModel");
//     console.log("Tenants:", tenants, "IDs:", ids);

//     let oListBinding = oModel.bindList(`/fetchWorkFlowById(tenants='${tenants}',ids='${ids}')`);
//     oListBinding.requestContexts(0, 99999).then((aContexts) => {
//         console.log("Raw Contexts:", aContexts);

//         // Process the data to extract unique startedBy values
//         var uniqueStartedBy = [];
//         aContexts.forEach(ctx => {
//             let instance = ctx.getObject();
//             if (instance.workflows) {
//                 instance.workflows.forEach(workflow => {
//                     if (workflow.data && workflow.data.startedBy) {
//                         uniqueStartedBy.push(workflow.data.startedBy);
//                     }
//                 });
//             }
//         });

//         // Remove duplicates and prepare data for ComboBox
//         uniqueStartedBy = [...new Set(uniqueStartedBy)].map(value => ({ key: value, text: value }));

//         // Bind the unique startedBy values to the MultiComboBox
//         var oDefinitionComboBox = that.byId("definitionids");
//         if (oDefinitionComboBox) {
//             var oDefinitionModel = new sap.ui.model.json.JSONModel();
//             oDefinitionModel.setData({ definition: uniqueStartedBy });
//             oDefinitionComboBox.setModel(oDefinitionModel);
//             oDefinitionComboBox.bindItems({
//                 path: "/definition",
//                 template: new sap.ui.core.Item({
//                     key: "{key}",
//                     text: "{text}"
//                 })
//             });
//         }

//         // Continue processing and updating the table data as needed
//         that.getOwnerComponent().closeBusyDialog();
//     }).catch((error) => {
//         console.error("Error retrieving workflow instances:", error);
//         that.getOwnerComponent().closeBusyDialog();
//     });
// },


// _getUniqueStartedBy: function (aData) {
//     // Extract unique startedBy values
//     let startedBySet = new Set();
//     aData.forEach(item => {
//         if (item.startedBy) {
//             startedBySet.add(item.startedBy);
//         }
//     });

//     // Convert Set back to an array of objects with text and key for MultiComboBox
//     return [...startedBySet].map(startedBy => ({
//         key: startedBy,
//         text: startedBy
//     }));
// },

// _bindUniqueStartedByToComboBox: function (uniqueStartedBy) {
//     // Bind unique 'startedBy' values to the MultiComboBox
//     let oDefinitionComboBox = this.byId("definitionids");
//     let oModel = new JSONModel({
//         definitionData: uniqueStartedBy
//     });

//     oDefinitionComboBox.setModel(oModel);
//     oDefinitionComboBox.setItems([
//         new sap.ui.core.Item({
//             key: "{key}",
//             text: "{text}"
//         })
//     ]);
// },










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
            this._updateItemCountForStatus();


            var nameLengthFilter = new sap.ui.model.Filter({
                path: 'subject',
                value1: sQuery,
                operator: sap.ui.model.FilterOperator.Contains
            });
            
            oBinding.filter(nameLengthFilter);
            this._searchFilter = aFilter ;
            this.applyCombinedFilters() ;

            // this._updateItemCountForStatus(oBinding);

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
        this._updateItemCountForStatus();
        this._statusFilter = aFilters;
        this.applyCombinedFilters();
            },

            // _updateItemCountForStatus: function (oBinding) {
            //     var oTable = this.byId("idProcessTables");
            //     var iFilteredCount = oBinding.getLength(); // Get the count of filtered items
                
            //     // Update the Title text
            //     var oTitle = oTable.getHeaderToolbar().getContent()[0]; // Assuming the Title is the first control in the Toolbar
            //     oTitle.setText("Items(" + iFilteredCount + ")");
            // },

            _updateItemCountForStatus: function () {
                var oTable = this.byId("idProcessTables");
                var oBinding = oTable.getBinding("items"); // Get the binding for the table

                var iFilteredCount = oBinding.getLength(); // Get the count of filtered items
                
                // Update the Title text
                var oTitle = oTable.getHeaderToolbar().getContent()[0]; // Assuming the Title is the first control in the Toolbar
                oTitle.setText("Items(" + iFilteredCount + ")");
        
            },

            applyCombinedFilters: function () {
                const oTable = this.byId("idProcessTables");
                const oBinding = oTable.getBinding("items");
            
                // Combine SearchField and MultiComboBox filters
                const aCombinedFilters = [].concat(this._searchFilter || [],  this._statusFilter || []);
            
                // Apply the combined filters
                oBinding.filter(aCombinedFilters, "Application");
            
                // Optional: Refresh the model if needed
                // this.getView().getModel().refresh(true); 
            
                // Update item count or other UI elements if required
                this._updateItemCountForStatus(oBinding);
            },

            onBackToOverview: function()
            {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Routeautomationhealthview");
            },



            // onSelectionChangefordefinition: function (oEvent) {
            //     // Get the selected keys from the MultiComboBox
            //     var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            //     var aFilters = [];
            
            //     // Create a filter for the selected 'startedBy' values
            //     if (aSelectedKeys.length > 0) {
            //         aSelectedKeys.forEach(function (sStartedBy) {
            //             aFilters.push(new Filter("startedBy", FilterOperator.EQ, sStartedBy));
            //         });
            //     }
            
            //     // Apply the filter to the table binding
            //     var oTable = this.byId("idProcessTables");
            //     var oBinding = oTable.getBinding("items");
            //     oBinding.filter(aFilters, "Application");
            
            //     // Optionally update item count
            //     this._updateItemCountForStatus();
            // },



            // onSelectionChangefordefinition: function (oEvent) {
            //     var aSelectedKeys = oEvent.getParameter("selectedKeys");
            //     console.log("Selected Keys:", aSelectedKeys);
            //     // Handle the selection change logic here
            // },
            
            

            // onDownload: function() {
            //     return new Promise((resolve, reject) => {
                   


            //         var oTable = this.byId("idProcessTables");
            //         var oBinding = oTable.getBinding("items");

            //         var aFilteredData = oBinding.getContexts();
            //         var aFilteredRowsData = [];

            //        // Iterate over each binding context and extract row data
            //         aFilteredData.forEach(function(oContext) {
            //        var oRowData = {};
            //      Object.keys(oContext.getObject()).forEach(function(sKey) {
            //          // Retrieve the value of each property
            //       oRowData[sKey] = oContext.getProperty(sKey);
            //    });
            //         aFilteredRowsData.push(oRowData);
            //    });

            //             new Spreadsheet({
            //                 workbook: {
            //                 columns: this.createColumnConfiguration() // Make sure this function is defined correctly
            //                 },
            //                     dataSource: aFilteredRowsData,
            //                     fileName: "EMPLOYEE_DETAILS_FROM_UI5.xlsx"  }).build()
            //                      .then(() => {
            //                      // Resolve the promise after successful export
            //                       resolve();
            //                        })
            //                        .catch((error) => {
            //                       // Reject the promise if an error occurs
            //                         reject(error);
            //                            });
            //                              });
            //                           },

            //                           createColumnConfiguration: function () {

            //                             return [
            //                             {
            //                             label: 'Process Name',
            //                             property: 'subject',
            //                             width: '15',
                                       
            //                             },
            //                             {
            //                             label: 'Status',
            //                             property: 'status',
            //                             width: '15',
                                       
            //                             },
            //                             {
            //                             label: 'Environment',
            //                             property: 'environmentId',
            //                             width: '15',
                                       
            //                             },
            //                             {
            //                             label: 'Project',
            //                             property: 'projectVersion',
            //                             width: '15',
                                       
            //                             },
                                      
            //                             {
            //                                 label: 'Started By',
            //                                 property: 'startedBy',
            //                                 width: '15',
                                           
            //                                 },
            //                                 {
            //                                     label: 'Started On',
            //                                     property: 'startedAt',
            //                                     width: '15',
                                               
            //                                     },
            //                                     {
            //                                         label: 'Completed On',
            //                                         property: 'gender',
            //                                         width: '15',
                                                   
            //                                         },
            //                             ];
            //                             }



            // onDownload: function() {
            //     return new Promise((resolve, reject) => {
            //         var oTable = this.byId("idProcessTables");
            //         var oBinding = oTable.getBinding("items");
            
            //         var aFilteredData = oBinding.getContexts();
            //         var aFilteredRowsData = [];
            
            //         // Iterate over each binding context and extract row data
            //         aFilteredData.forEach((oContext) => {  // Arrow function used here
            //             var oRowData = {};
            //             var oData = oContext.getObject();  // Get the actual data object from the context
            
            //             // Iterate over each property and apply formatters if necessary
            //             Object.keys(oData).forEach((sKey) => {  // Arrow function used here
            //                 var value = oContext.getProperty(sKey);
                            
            //                 // Apply formatter for "startedAt" and "completedAt"
            //                 if (sKey === "startedAt") {
            //                     value = this.formatter.formatDate(value); // Your existing date formatter
            //                 }
            //                 if (sKey === "completedAt") {
            //                     value = this.formatter.formatCompletedDate(value, oData.status); // Your existing completed date formatter
            //                 }
            
            //                 // If it's a date field, separate date and time
            //                 if (sKey === "startedAt" || sKey === "completedAt") {
            //                     // Format date and time separately
            //                     if (value instanceof Date) {
            //                         var date = value.toLocaleDateString("en-US"); // Format date
            //                         var time = value.toLocaleTimeString("en-US"); // Format time
            //                         oRowData[sKey + "_Date"] = date; // Store date
            //                         oRowData[sKey + "_Time"] = time; // Store time
            //                     } else {
            //                         oRowData[sKey] = value; // Keep the original value if it's not a date
            //                     }
            //                 } else {
            //                     oRowData[sKey] = value;
            //                 }
            //             });
            
            //             aFilteredRowsData.push(oRowData);
            //         });
            
            //         new Spreadsheet({
            //             workbook: {
            //                 columns: this.createColumnConfiguration() // Make sure this function is defined correctly
            //             },
            //             dataSource: aFilteredRowsData,
            //             fileName: "EMPLOYEE_DETAILS_FROM_UI5.xlsx"
            //         }).build()
            //         .then(() => {
            //             // Resolve the promise after successful export
            //             resolve();
            //         })
            //         .catch((error) => {
            //             // Reject the promise if an error occurs
            //             reject(error);
            //         });
            //     });
            // },
            


            onDownload: function() {
                return new Promise((resolve, reject) => {
                    var oTable = this.byId("idProcessTables");
                    var oItems = oTable.getItems(); // Get all the rows/items of the table
                    var aExportData = [];
            
                    // Iterate over each row/item and extract the visible text (formatted content)
                    oItems.forEach(function(oItem) {
                        var oRowData = {};
                        var oCells = oItem.getCells(); // Get all the cells in the row
            
                        // Extract the text from each cell
                        oCells.forEach(function(oCell, index) {
                            var sText = "";
            
                            // Check if the cell contains an Avatar control
                            if (oCell instanceof sap.m.Avatar) {
                                sText = oCell.getSrc(); // For Avatar controls, use getSrc (image or icon)
                            }
                            // Check if the cell is a Text control
                            else if (oCell instanceof sap.m.Text) {
                                sText = oCell.getText(); // For Text controls, use getText
                            }
                            // Check if the cell is a custom control with a 'text' property
                            else if (oCell.getProperty) {
                                sText = oCell.getProperty("text"); // For custom controls with 'text' property
                            }
                            // For other controls like Input, use getValue
                            else if (oCell.getValue) {
                                sText = oCell.getValue(); // For Input or other value-based controls, use getValue
                            }
            
                            // Store the extracted text in the row data, e.g., column1, column2, etc.
                            oRowData['column' + index] = sText;
                        });
            
                        // Add the row data to the export array
                        aExportData.push(oRowData);
                    });
            
                    // Build the Excel file
                    new Spreadsheet({
                        workbook: {
                            columns: this.createColumnConfiguration() // Ensure this method correctly defines your column headers
                        },
                        dataSource: aExportData,
                        fileName: "Process_Details_By_Tenant.xlsx"
                    }).build()
                    .then(() => {
                        // Resolve the promise after the export is completed
                        resolve();
                    })
                    .catch((error) => {
                        // Reject the promise if any error occurs
                        reject(error);
                    });
                });
            },
            
            
            
            
            
            

            // createColumnConfiguration: function () {
            //     return [
            //         {
            //             label: 'Process Name',
            //             property: 'subject',
            //             width: '15'
            //         },
            //         {
            //             label: 'Status',
            //             property: 'status',
            //             width: '15'
            //         },
            //         {
            //             label: 'Environment',
            //             property: 'environmentId',
            //             width: '15'
            //         },
            //         {
            //             label: 'Project',
            //             property: 'projectVersion',
            //             width: '15'
            //         },
            //         {
            //             label: 'Started By',
            //             property: 'startedBy',
            //             width: '25'
            //         },
            //         {
            //             label: 'Started On (Date)',
            //             property: 'startedAt_Date',
            //             width: '15'
            //         },
            //         {
            //             label: 'Started On (Time)',
            //             property: 'startedAt_Time',
            //             width: '15'
            //         },
            //         {
            //             label: 'Completed On (Date)',
            //             property: 'completedAt_Date',
            //             width: '15'
            //         },
            //         {
            //             label: 'Completed On (Time)',
            //             property: 'completedAt_Time',
            //             width: '15'
            //         }
            //     ];
            // }




            createColumnConfiguration: function() {
                return [
                    { label: 'Process Name', property: 'column1', width: '15' },
                    { label: 'Status', property: 'column2', width: '15' },
                    { label: 'Environment', property: 'column3', width: '15' },
                    { label: 'Project', property: 'column4', width: '15' },
                    { label: 'Started By', property: 'column5', width: '45' },
                    { label: 'Started On', property: 'column6', width: '25' },
                    { label: 'Completed On', property: 'column7', width: '25' }
                ];
            }
            
            
            

            


           

    });
            
});    

