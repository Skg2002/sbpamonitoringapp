sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/viz/ui5/controls/VizFrame",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text"
],
function (Controller,JSONModel,formatter, Filter, FilterOperator,VizFrame, FlattenedDataset, FeedItem,Dialog,mobileLibrary,Button,Text) {
    "use strict";
    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return Controller.extend("detaillogsapp.controller.detailsview", {
        formatter: formatter,
        onInit: function () {
          

            this.loadInstances();

            this.byId("idProductsTable").setVisible(true);
            this.byId("chartContainer").setVisible(false);

            this.selectedIndex = 0;



            //   var Accesories={
            //     Products:[
            //         {
            //             "Process Name":"Process A",
            //             "Process ID" : "abc567",
            //             "Status":"COMPLETED",
            //             "Execution Time": "10 mins",
            //             "Error Count":2,
            //             "Success Rate":"100%",
        

            //         },
            //         {
            //             "Process Name":"Process B",
            //             "Process ID" : "abc667",
            //             "Status":"COMPLETED",
            //             "Execution Time": "10 mins",
            //             "Error Count":3,
            //             "Success Rate":"100%",
        

            //         },
            //         {
            //             "Process Name":"Process C",
            //             "Process ID" : "POI123",
            //             "Status":"COMPLETED",
            //             "Execution Time": "10 mins",
            //             "Error Count":1,
            //             "Success Rate":"100%",
        

            //         },
            //         {
            //             "Process Name":"Process D",
            //             "Process ID" : "JKL456",
            //             "Status":"ERRONEOUS",
            //             "Execution Time": "10 mins",
            //             "Error Count":7,
            //             "Success Rate":"100%",
        

            //         },
            //         {
            //             "Process Name":"Process E",
            //             "Process ID" : "abc547",
            //             "Status":"READY",
            //             "Execution Time": "10 mins",
            //             "Error Count":6,
            //             "Success Rate":"100%",
        

            //         },
                    
            //     ]
            //    }
            //    var oModel = new JSONModel(Accesories);
            //    this.getView().setModel(oModel,"Items");
        
        
        },
       

        // async onOpenDialog(oEvent) {
        //     // Create dialog lazily
        //     this.oDialog ??= await this.loadFragment({
        //         name: "detaillogsapp.fragments.ShowLogs"
        //     });
        
        //     // Get the source of the event and the binding context of the selected item
        //     var oSource = oEvent.getSource();
        //     var oContext = oSource.getBindingContext("instanceModel");
        
        //     // Bind the dialog to the selected context
        //     this.oDialog.setBindingContext(oContext, "instanceModel");
        
        //     // Open the dialog
        //     this.oDialog.open();
        // },
                
        // async onOpenDialog(oEvent) {  //1st DRAFT
        //     // create dialog lazily
        //     this.oDialog ??= await this.loadFragment({
        //         name: "detaillogsapp.fragments.ShowLogs"
        //     });
        
        //     this.oDialog.open();
        //     var oSource = oEvent.getSource();
        //         var oContext = oSource.getBindingContext("instanceModel"); // Get the context of the clicked row
        //         var oLogData = oContext.getObject(); // Extract the full data for that instance
        //         var selectedIndex = oSource.getParent().getBindingContext("instanceModel").getPath().split("/").pop(); // Get the index of the clicked item

        //     //      // Set the selected index in the dialog model
        //     //     var logModel = new JSONModel({
        //     //                                selectedIndex: selectedIndex
        //     //                             });
        //     //     this.oDialog.setModel(logModel, "logData");

        //     //    // Open the dialog
        //     //      this.oDialog.open();
        //     var instanceData = oContext.getObject();
        //     var logsData = instanceData.logs || []; // Safely access logs
        
        //     // Create a new model for the logs and set it to the dialog
        //     var logModel = new JSONModel({ logs: logsData });
        //     this.oDialog.setModel(logModel, "logData");
        
        //     this.oDialog.open(); //1ST DRAFT
        // },

        async onOpenDialog(oEvent) {
            // Create dialog lazily if not already created
            this.oDialog ??= await this.loadFragment({
                name: "detaillogsapp.fragments.ShowLogs"
            });
        
            // Open the dialog first
            this.oDialog.open();
        
            // Get the source and context of the clicked row
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("instanceModel"); // Get the context of the clicked row
        
            if (oContext) {
                // Get the full path to the selected item in the model
                var sPath = oContext.getPath();
        
                // Get the specific instance data (process name and status)
                var instanceData = oContext.getObject();  // Get the object for the selected row
        
                // Extract logs data safely
                var logsData = instanceData.logs || [];
        
                // Create a new model for the process name, status, and logs, and set it to the dialog
                var logModel = new sap.ui.model.json.JSONModel({
                    subject: instanceData.instance.subject,   // Process Name
                    status: instanceData.instance.status,     // Status
                    logs: logsData                   // Logs data
                });
        
                // Set this new logData model to the dialog
                this.oDialog.setModel(logModel, "logData");
            }
        },
        
        

        
        //  onOpenLogDialog: function (oEvent) {

        //     this.oDialog ??=  this.loadFragment({
        //                 name: "detaillogsapp.fragments.ShowLogs"
        //             });
                
        //             this.oDialog.open();
        //     var oSource = oEvent.getSource();
        //     var oContext = oSource.getBindingContext("instanceModel"); // Get the context of the clicked row
        //     var oLogData = oContext.getObject(); // Extract the full data for that instance
        //     var selectedIndex = oSource.getParent().getBindingContext("instanceModel").getPath().split("/").pop(); // Get the index of the clicked item
        
        //     // Check if the fragment already exists
        //     // if (!this._pLogDialog) {
        //     //     this._pLogDialog = Fragment.load({
        //     //         id: this.getView().getId(),
        //     //         name: "detaillogsapp.view.ShowLogs",
        //     //         controller: this
        //     //     }).then(function (oDialog) {
        //     //         this.getView().addDependent(oDialog);
        //     //         return oDialog;
        //     //     }.bind(this));
        //     // }
        
        //     // this._pLogDialog.then(function (oDialog) {
        //     //     // Create a new model for the log entry based on the selected index
        //     //     var logModelData = {
        //     //         logs: [oLogData] // Assuming you want to show the selected log data
        //     //     };
                
        //     //     // Bind the log data to the fragment
        //     //     var oLogModel = new sap.ui.model.json.JSONModel(logModelData);
        //     //     oDialog.setModel(oLogModel, "logData");
        
        //     //     // Open the fragment
        //     //     oDialog.open();
        //     // }.bind(this));
        // },
        





        onClosePress: function(){
            this.byId("newproductdialog").close();
        },


        // onOKPress: function(){
        //     this.byId("detailproductdialog").close();
        // },


        onSelectionChange : function (oEvent) {
            // this.loadInstances(oEvent);
            var aSelectedKeys = this.byId("StatusMultiComboBox").getSelectedKeys();
    
                // Get the binding of the table items
                var oTable = this.byId("idProductsTable");
                var oBinding = oTable.getBinding("items");
                
                // Create a filter for the selected statuses
                var aFilters = [];
                if (aSelectedKeys.length > 0) {
                    aSelectedKeys.forEach(function (sStatus) {
                        aFilters.push(new sap.ui.model.Filter("instance/status", sap.ui.model.FilterOperator.EQ, sStatus));
                    });
    }
    
    // Apply the filter to the table
    oBinding.filter(aFilters, "Application");
        },
        onShowTable: function () {
            this.byId("idProductsTable").setVisible(true);
            this.byId("chartContainer").setVisible(false);
        },
       
        onShowChart: function () {
            this.byId("idProductsTable").setVisible(false);
            this.byId("chartContainer").setVisible(true);
        
            // Initialize the VizFrame if not already initialized
            // if (!this.oVizFrame) {
            //     this.oVizFrame = this.byId("idVizFrame");
                
            //     var oPopOver = this.byId("idPopOver");
            //     oPopOver.connect(this.oVizFrame.getVizUid());
        
            //     // Set up the chart properties
            //     this.oVizFrame.setVizProperties({
            //         plotArea: {
            //             dataLabel: {
            //                 visible: true
            //             }
            //         },
            //         title: {
            //             visible: true,
            //             text: 'Execution Time per Process'
            //         }
            //     });
        
            //     // Process duration into numerical values (convert duration into total hours)
            //     var oData = this.getView().getModel("instanceModel").getProperty("/value");
                
            //     oData.forEach(function(item) {
            //         // Convert duration "146h 3m 16s" into total hours
            //         item.totalHours = this._convertDurationToHours(item.duration);
            //     }.bind(this));
        
            //     // Set the dataset to map processName and executionTime
            //     var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            //         dimensions: [{
            //             name: "Process Name",
            //             value: "{instanceModel>instance/subject}" // Binding process name dimension
            //         }],
            //         measures: [{
            //             name: "Execution Time (Hours)",
            //             value: "{instanceModel>duration}" // Binding execution time measure
            //         }],
            //         data: {
            //             path: "instanceModel>/value" // Binding the data path from the model
            //         }
            //     });
        
            //     this.oVizFrame.setDataset(oDataset);
            //     this.oVizFrame.setVizType('bar');
        
            //     // Define the feedItems
            //     var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            //         uid: "valueAxis",
            //         type: "Measure",
            //         values: ["Execution Time (Hours)"]
            //     });
        
            //     var oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            //         uid: "categoryAxis",
            //         type: "Dimension",
            //         values: ["Process Name"]
            //     });
        
            //     this.oVizFrame.addFeed(oFeedValueAxis);
            //     this.oVizFrame.addFeed(oFeedCategoryAxis);
            // }
        },
        
        // Helper function to convert duration string to total hours
        _convertDurationToHours: function(durationStr) {
            var totalHours = 0;
            var hours = durationStr.match(/(\d+)h/); // Extract hours
            var minutes = durationStr.match(/(\d+)m/); // Extract minutes
        
            if (hours) {
                totalHours += parseInt(hours[1], 10);
            }
            if (minutes) {
                totalHours += parseInt(minutes[1], 10) / 60; // Convert minutes to hours
            }
        
            return totalHours;
        }
        
        ,

        onSearch:function(oEvent) { 
            // build filter array 
            // const aFilter = [];
            const aFilter = [];
            const sQuery = oEvent.getParameter("query");
            if (sQuery) {
             aFilter.push(new Filter("subject", FilterOperator.Contains, sQuery)); 
            }

            // filter binding
            const oList = this.byId("idProductsTable");
            // const oList =  sap.ui.getCore().byId("container-workflowmonitoring---Master--Fragment2Page--idProductsTable")
            const oBinding = oList.getBinding("items");  
            oBinding.filter(aFilter);

            var nameLengthFilter = new sap.ui.model.Filter({
                path: 'instance/subject',
                value1: sQuery,
                operator: sap.ui.model.FilterOperator.Contains
            });
            
            oBinding.filter(nameLengthFilter);
        },
        onFilterChange: function (oEvent) {
            var oFilterBar = oEvent.getSource(); // Get the FilterBar instance
            var aFilterItems = oFilterBar.getFilterGroupItems(); // Get all filter group items
        
            aFilterItems.forEach(function (oFilterItem) {
                var oControl;
                try {
                    oControl = oFilterItem.getControl(); // Get the control inside the filter item
                    if (!oControl) {
                        console.log("No control found for FilterGroupItem with name:", oFilterItem.getName ? oFilterItem.getName() : "Unknown");
                        return;
                    }
                } catch (error) {
                    console.error("Error retrieving control from FilterGroupItem:", error);
                    return;
                }
        
                var bMakeVisible = false;
        
                // Check if the control is a MultiComboBox or SearchField and has a value 
                if (oControl.isA("sap.m.MultiComboBox")) {
                    // For MultiComboBox  
                    bMakeVisible = oControl.getSelectedKeys().length > 0;
                } else if (oControl.isA("sap.m.SearchField")) {   
                    // For SearchField
                    bMakeVisible = oControl.getValue().trim() !== ""; 
                }
        
                if (bMakeVisible) {
                    oFilterItem.setVisibleInFilterBar(true); // Make the filter item visible
                }
            });
        
            // Trigger a search or update if necessary
            this.onSearch(); // Assuming you have an onSearch method to refresh data
        },
        loadInstances: function() { 
            var that = this;  
            var oView = this.getView();
            var oMultiComboBox = oView.byId("StatusMultiComboBox");

            var mapStatusToServiceValue = function(status) {      
                switch (status) {
                    case "Running":
                        return "RUNNING"; 
                    case "Error":
                        return "ERRONEOUS";
                    case "On Hold":
                        return "SUSPENDED";
                    case "Canceled":
                        return "CANCELED";
                    case "Completed":
                        return "COMPLETED";
                    default:
                        return status;   
                }
            };

            if (oMultiComboBox){
                var aSelectedItems = oMultiComboBox.getSelectedKeys();

                var mappedStatuses = aSelectedItems.map(mapStatusToServiceValue);
                var status = mappedStatuses.join(",");
            }
            else{
                console.error("MultiComboBox not found");
            }

            var oModel = new JSONModel();
                    this.getOwnerComponent().setModel(oModel, "instanceModel");
                    // var url = "./odata/v4/workflow/ExecutionLogs";     
                    // var payload ={"ids": [
                    //     // "aeb5335e-6a85-11ef-b4b2-eeee0a82f25f",
                    //     "066ba2fc-6f32-11ef-a458-eeee0a8eda73"
                    //   ]}
                          
                    var that = this;
                    var url = "./odata/v4/external/ExecutionLogs";     
                    var payload = {
                        "tenants": [
                            "SBPATenant1",
                            "SBPATenant2"
                        ],
                        "ids": [
                            "df9b5c29-7f1b-11ef-aee6-eeee0a9b1e07",
                            "cd5503b6-7f1b-11ef-814a-eeee0a82ecd3",
                            "7311c57b-7ef0-11ef-9d1f-eeee0a9bd33c",
                            "c4f7f3f5-7650-11ef-aac3-eeee0a8e9c41"
                        ]
                    };
                    
                    $.ajax({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(payload),
                        contentType: "application/json",
                        dataType: "json",
                        success: function(data) {
                            var logdata = [];

                            data.value.forEach(function(tenantData) {
                                if (tenantData.logs && tenantData.logs.length) {
                                    tenantData.logs.forEach(function(instance) {
                                        // Only push instances that do not contain the 'error' property
                                        if (!instance.error) {
                                            instance.tenant = tenantData.tenant;  // Add tenant information
                                            logdata.push(instance);  // Push the valid instance to the array
                                        }
                                    });
                                }
                            });
                             var oModel = that.getView().getModel("instanceModel");
                            if (!oModel) {
                                oModel = new sap.ui.model.json.JSONModel({ instances: logdata });
                                that.getView().setModel(oModel, "instanceModel");
                            } else {
                                oModel.setData({ instances: logdata });
                                oModel.refresh();
                            }
                        },
                        error: function(errorThrown) {
                            console.error("Failed to get contexts:", errorThrown);
                        }
                    });
                    
        },
        // onValueSelect: function(oEvent) {
        //     // Get the selected index from the event, for example
        //     var selectedIndex = oEvent.getSource().getBindingContext("instanceModel").getPath().split("/")[1];
            
        //     // Update the selectedIndex dynamically
        //     this.selectedIndex = selectedIndex;
        // }


        onValueSelect: function(oEvent) {
            // Get the selected index
            var selectedIndex = oEvent.getSource().getBindingContext("instanceModel").getPath().split("/")[1];
        
            // Get the reference to the table by its ID
            var oTable = this.byId("DetailsTable");
        
            // Create the dynamic path for the 'logs' collection based on the selected index
            var sPath = "instanceModel>/" + selectedIndex + "/logs";
        
            // Bind the 'items' aggregation programmatically to the dynamic path
            oTable.bindItems({
                path: sPath,
                template: oTable.getBindingInfo("items").template // Use the XML-defined template
            });
        },

        onBarSelect: function (oEvent) {
            // Get selected data
            var oData = oEvent.getParameter("data")[0].data;
            
            // Extract the relevant fields (e.g., Process Name and Status)
            var processName = oData["Process Name"];
            // var status = oData["status"];
            var executionTime = oData["Execution Time (In Hrs)"];
        
            // Show the information (you can also use other UI elements like MessageToast)
            sap.m.MessageToast.show("Process: " + processName + "\nExecution Time: " + executionTime+" "+"Hrs");
        },


        // onBarSelect: function (oEvent) {
        //     // Get the selected data from the event
        //     var oSelectedData = oEvent.getParameter("data")[0].data; // Access the first selected data point
        
        //     // Log the selected data to inspect the structure
        //     console.log(oSelectedData);
        
        //     // Access properties within the selected data
        //     var processName = oSelectedData.instance.subject; // Accessing the 'subject' under 'instance'
        //     var status = oSelectedData.instance.status; // Accessing the 'status' under 'instance'
        
        //     // Display the status and process name in a MessageToast or other UI elements
        //     sap.m.MessageToast.show("Process: " + processName + "\nStatus: " + status);
        // }
        
        formatMessage: function(type, userId, subject) {
            console.log("Type:", type, "UserId:", userId, "Subject:", subject); 
            
        
            if (type === "WORKFLOW_STARTED") {
                return userId + " started the instance";
            } else if(type === "EXCLUSIVE_GATEWAY_REACHED"){
                return subject + " reached";
            } else if (type === "AUTOMATIONTASK_CREATED") {
                return subject  + " started";
            } else if (type === "WORKFLOW_SUSPENDED") { 
                return userId + " put the instance on hold";
            } else if (type === "WORKFLOW_RESUMED") {
                return userId + " resumed the instance";
            } else if (type === "WORKFLOW_CONTINUED") {
                return userId + " retried the instance";
            } else if (type === "WORKFLOW_CANCELED") {
                return userId + " canceled the instance";
            } else if (type === "AUTOMATIONTASK_COMPLETED") {
                return subject + " completed successfully";
            } else if (type === "AUTOMATIONTASK_FAILED") {
                return subject + " failed";
            } else if(type === "USERTASK_CREATED"){
                return "Task " + subject + " available";
            } else if(type === "USERTASK_COMPLETED"){
                return userId + " completed the task " + subject;
            } else if (type === "WORKFLOW_COMPLETED") {
                return "Instance completed successfully";
            } else if (type === "REFERENCED_SUBFLOW_STARTED") {
                return "Referenced subflow " + subject + " is started";
            } else if (type === "REFERENCED_SUBFLOW_COMPLETED") {
                return "Referenced subflow " + subject + " completed successfully";
            } else if(type === "USERTASK_PATCHED_BY_ADMIN"){
                return userId + " updated the details of task " + subject;
            } else {
                return "Unknown event type: " + type; 
            } 
        },
          
        // async onDetailPress(oEvent) 
        // {


                
         
        //         // Get the context of the selected row
        //         var oSource = oEvent.getSource(); // The button that was pressed
        //         var oContext = oSource.getBindingContext("logData"); // Get the row data from the logData model
            
        //         // Extract the required data
        //         var sProcessName = oContext.getProperty("subject");
        //         var sStatus = oContext.getProperty("status");
            
        //         // Open the dialog and set the data to be displayed
        //         if (!this._oDialog) {
        //             // this._oDialog = sap.ui.xmlfragment("detaillogsapp.fragments.ShowLogsDetail", this);
        //             // this.getView().addDependent(this._oDialog);

        //               this.oDialog ??= await this.loadFragment({
        //               name: "detaillogsapp.fragments.ShowLogsDetail"
        //         });
            
        //         // Set data to the dialog model
        //         var oDialogModel = new sap.ui.model.json.JSONModel({
        //             processName: sProcessName,
        //             status: sStatus
        //         });
        //         this._oDialog.setModel(oDialogModel, "dialogData");
            
        //         // Open the dialog
        //         this._oDialog.open();
            
            





        //     //      // create dialog lazily
        //     // this.oDialog ??= await this.loadFragment({
        //     //     name: "detaillogsapp.view.ShowLogsDetail"
        //     // });
        
        //     // this.oDialog.open();
        //     // var oSource = oEvent.getSource();
        //     //     var oContext = oSource.getBindingContext("instanceModel"); // Get the context of the clicked row
        //     //     var oLogData = oContext.getObject(); // Extract the full data for that instance
        //     //     var selectedIndex = oSource.getParent().getBindingContext("instanceModel").getPath().split("/").pop(); // Get the index of the clicked item

        //     // //      // Set the selected index in the dialog model
        //     // //     var logModel = new JSONModel({
        //     // //                                selectedIndex: selectedIndex
        //     // //                             });
        //     // //     this.oDialog.setModel(logModel, "logData");

        //     // //    // Open the dialog
        //     // //      this.oDialog.open();
        //     // var instanceData = oContext.getObject();
        //     // var logsData = instanceData.logs || []; // Safely access logs
        
        //     // // Create a new model for the logs and set it to the dialog
        //     // var logModel = new JSONModel({ logs: logsData });
        //     // this.oDialog.setModel(logModel, "logData");
        
        //     // this.oDialog.open(); //1ST DRAFT
        // },
        async onDetailPress(oEvent) {
            // Get the context of the selected row
            // var oSource = oEvent.getSource(); // The button that was pressed
            // var oContext = oSource.getBindingContext("logData"); // Get the row data from the logData model
        
            // // Extract the required data
            // var sProcessName = oContext.getProperty("subject");
            // var sStatus = oContext.getProperty("status");
           var oSource = oEvent.getSource().getBindingContext("logData").getObject();
        
            // Open the dialog and set the data to be displayed
            if (!this._oDialog) {
                // Load the fragment lazily as a dialog
                this._oDialog = await sap.ui.xmlfragment(".", this);
                this.getView().addDependent(this._oDialog); // Add the dialog as a dependent
            }
        
            // Set data to the dialog model
            var oDialogModel = new sap.ui.model.json.JSONModel(oSource);
    
            // Set the model to the dialog with a named model "dialogData"
            this._oDialog.setModel(oDialogModel, "dialogData");
        
            // Open the dialog
            this._oDialog.open();
        },
        
        
       
        // onDetailPress:function(oEvent){

        //     var oView = this.getView();

        //     // Create the dialog lazily
        //     if (!this.byId("newDetailDialog")) {
        //         // Load the dialog XML fragment and set the model to the dialog
        //         sap.ui.core.Fragment.load({
        //             id: oView.getId(),
        //             name: "detaillogsapp.view.DetailDialog", // If in separate fragment file
        //             controller: this
        //         }).then(function (oDialog) {
        //             oView.addDependent(oDialog);
        //             oDialog.bindElement({
        //                 path: oEvent.getSource().getBindingContext("instanceModel").getPath(),
        //                 model: "instanceModel"
        //             });
        //             oDialog.open();
        //         });
        //     } else {
        //         // If dialog already exists, open it
        //         var oDialog = this.byId("newDetailDialog");
        //         oDialog.bindElement({
        //             path: oEvent.getSource().getBindingContext("instanceModel").getPath(),
        //             model: "instanceModel"
        //         });
        //         oDialog.open();
        //     }
        // },

        onOKPress: function() {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});
