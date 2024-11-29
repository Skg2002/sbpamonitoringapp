sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Popover",
    "sap/m/Text",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/m/Token"
], function (Controller, JSONModel, Fragment, List, StandardListItem, Popover,Text,ChartFormatter,Token) {
    "use strict";

    return Controller.extend("automationhealthapp.controller.automationhealthview", {
        onInit: function () {

            var oBarModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oBarModel, "barModel");

            var oDonutModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oDonutModel, "donutModel");

            var automationDetailsModel = new sap.ui.model.json.JSONModel({
                instances: [],
                failedCounts: [],
                completedStatusData:[],
                totalFailedCount: 0, 
                totalExecutionTime: 0
            });
        
        this.getView().setModel(automationDetailsModel, "automationDetailsModel");
        var oExecutionModel = new sap.ui.model.json.JSONModel({ totalExecutionTime: 0 }); // Initialize with 0
            this.getView().setModel(oExecutionModel, "executionModel");


            // var oBackButton = this.byId("bck2line");
            // if (oBackButton) {
            //     oBackButton.setVisible(true); // Make sure it's visible when the view is initialized
            //     oBackButton.setEnabled(true); // Ensure it's enabled
            // }

             // Attach routing lifecycle function
    


            
            var oVizLineFrame = this.getView().byId("idLineChart");
            var oVizPieFrame = this.getView().byId("idVizFramePie");
            var oVizAutomation =this.getView().byId("maxResponseTimeChart");
            var ovizErrorLine=this.getView().byId("lineChart");
            var ovizErrorCode=this.getView().byId("idVizFrames");
            var oVizBarFrame = this.getView().byId("idBarChart");
           

            // Set VizFrame properties, including title
            oVizLineFrame.setVizProperties({
                title: {
                    visible: true,
                    text: "Process Count w.r.t Time"
                }
            });
            oVizAutomation.setVizProperties({
                title: {
                    visible: true,
                    text: "Execution Time Over Date"
                }
            });
            ovizErrorLine.setVizProperties({
                title: {
                    visible: true,
                    text: "Failed Automation Over Date"
                }
            });
            ovizErrorCode.setVizProperties({
                title: {
                    visible: false,
                }
            });
            


            // oVizLineFrame.setVizProperties({
            //     title: { visible: true, text: "Process Count w.r.t Time" },
            //     plotArea: {
            //         dataLabel: { visible: true },
            //         primaryValueAxis: {
            //             title: { visible: true, text: "Process Count" },
            //             label: { formatString: '0' }, // Integer formatting
            //             scale: { fixedRange: true, min: 0, max: 10 } // Initial y-axis range; adjust dynamically below
            //         },
            //         primaryCategoryAxis: { title: { visible: true, text: "Time" } }
            //     }
            // });







            oVizPieFrame.setVizProperties({
                title: {
                    visible: true,
                    text: "Status Monitoring"
                }
            });

            oVizBarFrame.setVizProperties({
                title: {
                    visible: true,
                    text: "Tenant-wise Process Visualization"
                }
            });
            
            this.fetchedData = [];
            this._selectedStatuses = [];
            let oDateRangeSelection = this.byId("dateTimePicker");

            if (oDateRangeSelection) {
                let oStartDate = new Date();
                oStartDate.setHours(0, 0, 0, 0);

                let oEndDate = new Date();
                oEndDate.setHours(23, 59, 59, 999);

                oDateRangeSelection.setDateValue(oStartDate);
                oDateRangeSelection.setSecondDateValue(oEndDate);

                // this.onDateChange();
            } else {
                console.error("DateRangeSelection not found!");
            }

            // var oLineChart = this.byId("idLineChart");
            // oLineChart.attachEvent("onhover", this.onLineChartHover, this);
            this.loaderror();
            this._preSelectTokens();
            // this._loadDestination();
            // this.loadData();

        },


        
        // onIconTabFilterSelect: function (oEvent) {
        //     const sSelectedKey = oEvent.getParameter("key");
        
        //     if (sSelectedKey === "overview") {
        //         // Assuming `pieChartId` is the ID of your Pie Chart control
        //         const oPieChart = this.byId("idVizFramePie");
                
        //         if (oPieChart) {
        //             // Refresh the Pie Chart's binding
        //             const oModel = oPieChart.getModel(); // Replace with actual model if needed
        //             const sBindingPath = oPieChart.getBindingPath("dataset"); // Adjust as per your binding
        //             oPieChart.bindElement(sBindingPath);
        //             oPieChart.invalidate(); // Force re-rendering
        //         }
        //     }
        // },
        
      
        


        // _loadDestination: function() {
        //     var oModel = this.getOwnerComponent().getModel("wfModel");
        //     let oBindList = oModel.bindList(`/Destinations`);
        
        //     oBindList.requestContexts().then(function(aContexts) {
        //         var aDestinations = aContexts.map(function(oContext) {
        //             return oContext.getObject();
        //         });

        //         var oDestination = aDestinations.find(function(oDest) {
        //             return oDest.ID === 2;
        //         });

        //         if (oDestination) {
        //             this.fetchworkflow(oDestination);
        //         }
               

        //         var oDestinationModel = new sap.ui.model.json.JSONModel(aDestinations);
        //         this.getView().setModel(oDestinationModel, "destinationModel");
        //     }.bind(this));
        // },


        // onLineChartHover: function (oEvent) {
        //     // Get the data point being hovered
        //     var oHoveredData = oEvent.getParameter("data");

        //     if (oHoveredData) {
        //         // Example: The data can contain a timestamp and process count
        //         var timestamp = oHoveredData[0].getData().Timestamp;
        //         var processCount = oHoveredData[0].getData().ProcessCount;

        //         // Prepare the content for the Popover
        //         var sPopoverContent = "Timestamp: " + timestamp + "\nProcess Count: " + processCount;

        //         // Set the text of the Popover
        //         this._popover.getContent()[0].setText(sPopoverContent);

        //         // Get the position for the Popover based on the hovered point
        //         var oChart = this.getView().byId("idLineChart");
        //         var oPosition = oEvent.getParameter("event").getSource().getDomRef().getBoundingClientRect();

        //         // Open the Popover at the right position
        //         this._popover.openBy(oChart);
        //         this._popover.setOffsetX(oPosition.left + 10);  // Adjust the X position
        //         this._popover.setOffsetY(oPosition.top + 10);   // Adjust the Y position
        //     }
        // },

        fetchworkflow: function(oDestination) {
            var oMultiComboBox = this.byId("tenantBox");
        
            var sTenant = oDestination.dest_name; 
            oMultiComboBox.setSelectedKeys(sTenant); 
        
            // Automatically trigger data loading for the selected tenant
            this.loadData(sTenant);
        },

        onTenantChange: function(oEvent) {
            var aSelectedItems = oEvent.getSource().getSelectedItems();
            var aTenants = aSelectedItems.map(function(oItem) {
                return oItem.getKey();
            });
            let tenants = aTenants.join(",");
        
            if (!tenants) {
                // oDatePicker.setDateValue(null);

                }
        
            // Load data for the selected tenants
            this.loadData(tenants);
        },

        loadData: function (tenants) {
            let that = this;
            // this.getOwnerComponent().openBusyDialog();
            let oModel = this.getOwnerComponent().getModel("wfModel");
        
            let oListBinding = oModel.bindList(`/getfilteration(tenants='${tenants}',status='')`);
            oListBinding.requestContexts(0, 99999).then((aContexts) => {
                // Flatten the data across all tenants into a single array
                this.fetchedData = aContexts.flatMap(ctx => {
                    let instance = ctx.getObject();
                    // Each instance contains a 'tenant' and 'data' property
                    return instance.data.map(dataItem => ({
                        ...dataItem,
                        tenant: instance.tenant  // Add tenant property to each data item
                    }));
                });
        
                console.log("Fetched Data as Array:", this.fetchedData);
        
                // Generate fetchedIdsString from the array format of fetchedData
                this.fetchedIdsString = this.fetchedData.map(instance => instance.id).join('%2C');
        
                // Use promises to ensure analyzeAutomation and fetchAutomationDetails complete first
                Promise.all([
                    new Promise((resolve, reject) => {
                        try {
                            this.analyzeAutomation(that, tenants, this.fetchedIdsString);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }),
                    new Promise((resolve, reject) => {
                        try {
                            this.fetchAutomationDetails(this.fetchedIdsString, tenants);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    })
                ]).then(() => {
                    // Call onDateChange after both promises are fulfilled
                    this.onDateChange();
                }).catch((error) => {
                    console.error("Error in analyzeAutomation or fetchAutomationDetails:", error);
                }).finally(() => {
                    // that.getOwnerComponent().closeBusyDialog();
                });
        
            }).catch((error) => {
                console.error("Error retrieving workflow instances:", error);
                that.getOwnerComponent().closeBusyDialog();
            });
        },
        
        


        // loadData: function (tenants) {
        //     let that = this;
        //     this.getOwnerComponent().openBusyDialog();
        //     let oModel = this.getOwnerComponent().getModel("wfModel");
        
        //     let oListBinding = oModel.bindList(`/getfilteration(tenants='${tenants}',status='')`);
        //     oListBinding.requestContexts(0, 99999).then((aContexts) => {
        //         // Create fetchedData as an object where each tenant has its corresponding data
        //         this.fetchedData = {};
        //         aContexts.forEach(ctx => {
        //             let instance = ctx.getObject();
        //             // Assuming instance contains a 'tenant' property and 'data'
        //             if (instance.tenant) {
        //                 // Initialize the array for this tenant if it doesn't exist
        //                 if (!this.fetchedData[instance.tenant]) {
        //                     this.fetchedData[instance.tenant] = [];
        //                 }
        //                 // Push the data to the respective tenant
        //                 this.fetchedData[instance.tenant].push(...instance.data);
        //             }
        //         });
        
        //         console.log("Fetched Data as Object:", this.fetchedData);
        
        //         this.fetchedIdsString = Object.values(this.fetchedData)
        //             .flat()
        //             .map(instance => instance.id)
        //             .join('%2C');
        
        //         this.analyzeAutomation(that, tenants, this.fetchedIdsString);
        
        //         // Call groupByTenant with the new structure
        //         let oGroupedData = that.groupByTenant(this.fetchedData);
        //         let { allIds, erroneousIds } = that.getAllIdsByTenant(oGroupedData);
        
        //         that.getOwnerComponent().closeBusyDialog();
        //     }).catch((error) => {
        //         console.error("Error retrieving workflow instances:", error);
        //         that.getOwnerComponent().closeBusyDialog();
        //     });
        // },
        
        

        // loadData: function (tenants) {
        //     let that = this;
        //     // let tenant = 'SBPATenant3%2CSBPATenant2%2CSBPATenant1';
        //     this.getOwnerComponent().openBusyDialog();
        //     let oModel = this.getOwnerComponent().getModel("wfModel");

        //     let oListBinding = oModel.bindList(`/getfilteration(tenants='${tenants}',status='')`);
        //     oListBinding.requestContexts(0, 99999).then((aContexts) => {
        //         this.fetchedData = aContexts.flatMap((ctx) => ctx.getObject().data);


        //         this.fetchedIdsString = this.fetchedData.map(instance => instance.id).join('%2C');
        //         this.analyzeAutomation(that, tenants, this.fetchedIdsString);

        //         let oGroupedData = that.groupByTenant(this.fetchedData);
        //         let { allIds, erroneousIds } = that.getAllIdsByTenant(oGroupedData);

              
                
        //         that.getOwnerComponent().closeBusyDialog();
        //     }).catch((error) => {
        //         console.error("Error retrieving workflow instances:", error);
        //         that.getOwnerComponent().closeBusyDialog();
        //     });
        // },

        groupByTenant: function(fetchedData) {
            let oGroupedData = fetchedData.reduce((result, item) => {
                if (!result[item.tenant]) {
                    result[item.tenant] = {
                        tenant: item.tenant,
                        data: []
                    };
                }
                result[item.tenant].data.push(item);
                return result;
            }, {});
        
            // Convert the grouped data object to an array
            return Object.values(oGroupedData);
        },
        




        // groupByTenant: function(fetchedData) {
        //     return fetchedData.reduce((result, item) => {
        //         if (!result[item.tenant]) {
        //             result[item.tenant] = {
        //                 tenant: item.tenant,
        //                 data: []
        //             };
        //         }
        //         result[item.tenant].data.push(item);
        //         return result;
        //     }, {});
        // },
        

        // groupByTenant: function(fetchedData) {
        //     // If fetchedData is already structured as an object with tenants as keys, you can return it directly
        //     return Object.entries(fetchedData).map(([tenant, data]) => ({
        //         tenant: tenant,
        //         data: data
        //     }));
        // },
        getAllIdsByTenant: function(oGroupedData) {
            let allIds = [];
            let erroneousIds = [];
        
            oGroupedData.forEach(oTenantGroup => {
                // oTenantGroup.data is now an array of workflows
                oTenantGroup.data.forEach(oWorkflow => {
                    allIds.push(oWorkflow.id);
                    if (oWorkflow.status === "ERRONEOUS") {
                        erroneousIds.push(oWorkflow.id);
                    }
                });
            });
        
            return { allIds, erroneousIds };
        },
        





        async analyzeAutomation(that, tenants, instanceID) {
            let oModel = this.getOwnerComponent().getModel("wfModel");
            // this.getOwnerComponent().openBusyDialog();
            let oListBinding = oModel.bindList(`/analyzeAutomationLoad(tenants='${tenants}',instanceIds='${instanceID}')`);
            oListBinding.requestContexts(0, 99999).then((aContexts) => {
                var contextData = aContexts.map((oContext) => oContext.getObject());
                that.getOwnerComponent().getModel("appModel").setProperty("/botMessage", contextData[0].value);
                // that.getOwnerComponent().closeBusyDialog();
            }).catch((error) => {
                console.error("Error retrieving workflow instances:", error);
                that.getOwnerComponent().closeBusyDialog();
            });
        },

        onDateChange: function () {
            this.getOwnerComponent().openBusyDialog();
            let oDateRangeSelection = this.byId("dateTimePicker");
            let startDate = oDateRangeSelection.getDateValue();
            let endDate = oDateRangeSelection.getSecondDateValue();

            if (!startDate || !endDate || startDate > endDate) {
                console.error("Invalid date range selected.");
                return; // Stop further processing
            }

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            // var oDateRangeSelector = that.getView().byId("dateTimePicker");
            // var dateRange = oDateRangeSelector.getDateValue() && oDateRangeSelector.getSecondDateValue();

            let oBarChartContainer = this.byId("barChartContainer");
            if (oBarChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToLineChart();
            }
            // Check if the Donut Chart is visible
            let oDonutChartContainer = this.byId("donutChartContainer");
            if (oDonutChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToPieChart();
            }

                this._filterDataByDateRange(startDate, endDate);

            this.filterData(startDate, endDate, this._selectedStatuses);
        },

        filterData: function (startDate, endDate, selectedStatuses) {
            if (!startDate || !endDate) {
                console.error("No date range selected.");
                return;
            }

            let filteredData = this.fetchedData.filter((instance) => {
                let instanceDate = new Date(instance.startedAt);
                return instanceDate >= startDate && instanceDate <= endDate;
            });

            if (selectedStatuses && selectedStatuses.length > 0) {
                filteredData = filteredData.filter(instance => {
                    let mappedStatus = this.mapStatusToServiceValue(instance.status);
                    return selectedStatuses.includes(mappedStatus);
                });
            }

            this.processFilteredData(filteredData, startDate, endDate);
        },

        



        // processFilteredData: function (filteredData, startDate, endDate) {
        //     let instanceDetailsArray = [];
        //     let processData = {};
        //     let tenantData = {};  // Store tenant counts grouped by Timestamp
        //     let tenantDataByStatus = {}; // Store tenant counts grouped by Status for Pie/Donut charts
        
        //     // Determine whether to group by hour, day, or month
        //     const sameDay = startDate.toDateString() === endDate.toDateString();
        
        //     if (sameDay) {
        //         filteredData.forEach(instance => {
        //             let hourKey = new Date(instance.startedAt).getHours();
        //             let formattedTime = this.formatTime(instance.startedAt); // Format time for display
        
        //             // Count the process occurrences
        //             processData[formattedTime] = (processData[formattedTime] || 0) + 1;
        
        //             // Count the tenants per timestamp
        //             if (!tenantData[formattedTime]) {
        //                 tenantData[formattedTime] = {};
        //             }
        //             tenantData[formattedTime][instance.tenant] = (tenantData[formattedTime][instance.tenant] || 0) + 1;
        
        //             // Count tenants per status (for Pie/Donut chart)
        //             if (!tenantDataByStatus[instance.status]) {
        //                 tenantDataByStatus[instance.status] = {};
        //             }
        //             tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
        //             instanceDetailsArray.push({
        //                 SubjectName: instance.subject,
        //                 StartedAt: instance.startedAt,
        //                 Status: instance.status,
        //             });
        //         });
        //     } else if ((endDate - startDate) / (1000 * 60 * 60 * 24) <= 31) {
        //         filteredData.forEach(instance => {
        //             let dateKey = instance.startedAt.substring(0, 10); // Format: YYYY-MM-DD
        
        //             // Count the process occurrences
        //             processData[dateKey] = (processData[dateKey] || 0) + 1;
        
        //             // Count the tenants per date
        //             if (!tenantData[dateKey]) {
        //                 tenantData[dateKey] = {};
        //             }
        //             tenantData[dateKey][instance.tenant] = (tenantData[dateKey][instance.tenant] || 0) + 1;
        
        //             // Count tenants per status (for Pie/Donut chart)
        //             if (!tenantDataByStatus[instance.status]) {
        //                 tenantDataByStatus[instance.status] = {};
        //             }
        //             tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
        //             instanceDetailsArray.push({
        //                 SubjectName: instance.subject,
        //                 StartedAt: instance.startedAt,
        //                 Status: instance.status,
        //             });
        //         });
        //     } else {
        //         filteredData.forEach(instance => {
        //             let monthKey = new Date(instance.startedAt).toLocaleString('default', { month: 'long', year: 'numeric' });
        
        //             // Count the process occurrences
        //             processData[monthKey] = (processData[monthKey] || 0) + 1;
        
        //             // Count the tenants per month
        //             if (!tenantData[monthKey]) {
        //                 tenantData[monthKey] = {};
        //             }
        //             tenantData[monthKey][instance.tenant] = (tenantData[monthKey][instance.tenant] || 0) + 1;
        
        //             // Count tenants per status (for Pie/Donut chart)
        //             if (!tenantDataByStatus[instance.status]) {
        //                 tenantDataByStatus[instance.status] = {};
        //             }
        //             tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
        //             instanceDetailsArray.push({
        //                 SubjectName: instance.subject,
        //                 StartedAt: instance.startedAt,
        //                 Status: instance.status,
        //             });
        //         });
        //     }
        
        //     const totalLogs = filteredData.length;
        //     let oInstanceDetailsModel = new JSONModel({ InstanceDetails: instanceDetailsArray });
        //     this.getView().setModel(oInstanceDetailsModel, "instanceDetailsModel");
        
        //     let chartData = Object.keys(processData).map(key => ({
        //         Timestamp: sameDay && typeof key === "number" ? key + ":00" : key, // Add ":00" for hours
        //         ProcessCount: processData[key]
        //     }));
        
        //     let statusCounts = filteredData.reduce((acc, instance) => {
        //         acc[instance.status] = (acc[instance.status] || 0) + 1;
        //         return acc;
        //     }, {});
        
        //     let pieData = Object.keys(statusCounts).map(status => ({
        //         Status: status,
        //         Count: statusCounts[status]
        //     }));
        
        //     // Now that we have both processData and tenantData, let's store it in models
        //     this._updateModels(chartData, pieData, totalLogs, startDate, endDate, tenantData, tenantDataByStatus);
        // },

        processFilteredData: function (filteredData, startDate, endDate) {
            let instanceDetailsArray = [];
            let processData = {};
            let tenantData = {}; // Store tenant counts and their respective IDs grouped by Timestamp
            let tenantDataByStatus = {}; // Store tenant counts grouped by Status for Pie/Donut charts
        
            // Determine whether to group by hour, day, or month
            const sameDay = startDate.toDateString() === endDate.toDateString();
        
            filteredData.forEach(instance => {
                if (sameDay) {
                    let hourKey = new Date(instance.startedAt).getHours();
                    let formattedTime = this.formatTime(instance.startedAt); // Format time for display
        
                    // Count the process occurrences
                    processData[formattedTime] = (processData[formattedTime] || 0) + 1;
        
                    // Count the tenants per timestamp
                    if (!tenantData[formattedTime]) {
                        tenantData[formattedTime] = {};
                    }
                    if (!tenantData[formattedTime][instance.tenant]) {
                        tenantData[formattedTime][instance.tenant] = {
                            count: 0,
                            ids: []
                        };
                    }
                    tenantData[formattedTime][instance.tenant].count += 1;
                    tenantData[formattedTime][instance.tenant].ids.push(instance.id); // Collect the IDs
        
                    // Count tenants per status (for Pie/Donut chart)
                    if (!tenantDataByStatus[instance.status]) {
                        tenantDataByStatus[instance.status] = {};
                    }
                    tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
                    instanceDetailsArray.push({
                        SubjectName: instance.subject,
                        StartedAt: instance.startedAt,
                        Status: instance.status,
                    });
                } else if ((endDate - startDate) / (1000 * 60 * 60 * 24) <= 31) {
                    let dateKey = instance.startedAt.substring(0, 10); // Format: YYYY-MM-DD
        
                    // Count the process occurrences
                    processData[dateKey] = (processData[dateKey] || 0) + 1;
        
                    // Count the tenants per date
                    if (!tenantData[dateKey]) {
                        tenantData[dateKey] = {};
                    }
                    if (!tenantData[dateKey][instance.tenant]) {
                        tenantData[dateKey][instance.tenant] = {
                            count: 0,
                            ids: []
                        };
                    }
                    tenantData[dateKey][instance.tenant].count += 1;
                    tenantData[dateKey][instance.tenant].ids.push(instance.id); // Collect the IDs
        
                    // Count tenants per status (for Pie/Donut chart)
                    if (!tenantDataByStatus[instance.status]) {
                        tenantDataByStatus[instance.status] = {};
                    }
                    tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
                    instanceDetailsArray.push({
                        SubjectName: instance.subject,
                        StartedAt: instance.startedAt,
                        Status: instance.status,
                    });
                } else {
                    let monthKey = new Date(instance.startedAt).toLocaleString('default', { month: 'long', year: 'numeric' });
        
                    // Count the process occurrences
                    processData[monthKey] = (processData[monthKey] || 0) + 1;
        
                    // Count the tenants per month
                    if (!tenantData[monthKey]) {
                        tenantData[monthKey] = {};
                    }
                    if (!tenantData[monthKey][instance.tenant]) {
                        tenantData[monthKey][instance.tenant] = {
                            count: 0,
                            ids: []
                        };
                    }
                    tenantData[monthKey][instance.tenant].count += 1;
                    tenantData[monthKey][instance.tenant].ids.push(instance.id); // Collect the IDs
        
                    // Count tenants per status (for Pie/Donut chart)
                    if (!tenantDataByStatus[instance.status]) {
                        tenantDataByStatus[instance.status] = {};
                    }
                    tenantDataByStatus[instance.status][instance.tenant] = (tenantDataByStatus[instance.status][instance.tenant] || 0) + 1;
        
                    instanceDetailsArray.push({
                        SubjectName: instance.subject,
                        StartedAt: instance.startedAt,
                        Status: instance.status,
                    });
                }
            });
        
            // Convert IDs array to string joined by '%2C'
            Object.keys(tenantData).forEach(timestamp => {
                Object.keys(tenantData[timestamp]).forEach(tenant => {
                    tenantData[timestamp][tenant].ids = tenantData[timestamp][tenant].ids.join('%2C');
                });
            });
        
            const totalLogs = filteredData.length;
            let oInstanceDetailsModel = new JSONModel({ InstanceDetails: instanceDetailsArray });
            this.getView().setModel(oInstanceDetailsModel, "instanceDetailsModel");
        
            let chartData = Object.keys(processData).map(key => ({
                Timestamp: sameDay && typeof key === "number" ? key + ":00" : key, // Add ":00" for hours
                ProcessCount: processData[key]
            }));
        
            let statusCounts = filteredData.reduce((acc, instance) => {
                acc[instance.status] = (acc[instance.status] || 0) + 1;
                return acc;
            }, {});
        
            let pieData = Object.keys(statusCounts).map(status => ({
                Status: status,
                Count: statusCounts[status]
            }));
        
            // Update models with the processed data
            this._updateModels(chartData, pieData, totalLogs, startDate, endDate, tenantData, tenantDataByStatus);
        },
        
        
        
        
 



        // _updateModels: function (lineData, pieData, totalLogs, startDate, endDate) {
        //     let oLineModel = new JSONModel({
        //         LineData: lineData,
        //         TotalLogs: totalLogs
        //     });
        //     this.getView().setModel(oLineModel, "lineModel");
        
        //     // Calculate the maximum ProcessCount in lineData
        //     let maxProcessCount = Math.max(...lineData.map(item => item.ProcessCount || 0));
        
        //     // Conditionally set or reset y-axis range
        //     let oVizFrame = this.getView().byId("idLineChart");
        //     if (maxProcessCount <= 2) {
        //         // Call updateYAxisRange with a fixed range for low ProcessCount values
        //         this.updateYAxisRange(oVizFrame, 0, 4);
        //     } else {
        //         // Reset the primaryScale to enable automatic scaling
        //         oVizFrame.setVizProperties({
        //             "plotArea": {
        //                 "primaryScale": {
        //                     "fixedRange": false
        //                 }
        //             }
        //         });
        //     }
        
        //     // Update the pie chart model
        //     let statusCounts = pieData.reduce((acc, entry) => {
        //         acc[entry.Status] = entry.Count;
        //         return acc;
        //     }, {});
        
        //     let oPieModel = new JSONModel({
        //         PieData: pieData,
        //         ErroneousCount: statusCounts["ERRONEOUS"] || 0,
        //         RunningCount: statusCounts["RUNNING"] || 0,
        //         CompletedCount: statusCounts["COMPLETED"] || 0,
        //         CanceledCount: statusCounts["CANCELED"] || 0,
        //         SuspendedCount: statusCounts["SUSPENDED"] || 0
        //     });
        //     this.getView().setModel(oPieModel, "pieModel");
        
        //     this.getOwnerComponent().closeBusyDialog();
        // },



        _updateModels: function (lineData, pieData, totalLogs, startDate, endDate, tenantData, tenantDataByStatus) {
            let oLineModel = new JSONModel({
                LineData: lineData,
                TotalLogs: totalLogs
            });
            this.getView().setModel(oLineModel, "lineModel");
        
            let maxProcessCount = Math.max(...lineData.map(item => item.ProcessCount || 0));
            let oVizFrame = this.getView().byId("idLineChart");
            if (maxProcessCount <= 2) {
                this.updateYAxisRange(oVizFrame, 0, 4);
            } else {
                oVizFrame.setVizProperties({
                    "plotArea": {
                        "primaryScale": {
                            "fixedRange": false
                        }
                    }
                });
            }
        
            let statusCounts = pieData.reduce((acc, entry) => {
                acc[entry.Status] = entry.Count;
                return acc;
            }, {});
        
            let oPieModel = new JSONModel({
                PieData: pieData,
                ErroneousCount: statusCounts["ERRONEOUS"] || 0,
                RunningCount: statusCounts["RUNNING"] || 0,
                CompletedCount: statusCounts["COMPLETED"] || 0,
                CanceledCount: statusCounts["CANCELED"] || 0,
                SuspendedCount: statusCounts["SUSPENDED"] || 0
            });
            this.getView().setModel(oPieModel, "pieModel");
        
            // Set tenant data for bar chart
            this._tenantData = tenantData; // Store the tenant data in a member variable
            this._tenantDataByStatus = tenantDataByStatus; // Store the tenant data by status for donut chart
        
            this.getOwnerComponent().closeBusyDialog();
        },
        
        
        
        
        updateYAxisRange: function (oVizFrame, min, max) {
            var oVizProperties = {
                "plotArea": {
                    "dataLabel": {
                        "visible": true
                    },
                    "primaryScale": {
                        "fixedRange": true,
                        "minValue": min,
                        "maxValue": max
                    }
                }
            };
            
            oVizFrame.setVizProperties(oVizProperties);
        },
        

       




      
        

        
        
        

        mapStatusToServiceValue: function (status) {
            switch (status) {
                case "Running": return "RUNNING";
                case "Error": return "ERRONEOUS";
                case "On Hold": return "SUSPENDED";
                case "Canceled": return "CANCELED";
                case "Completed": return "COMPLETED";
                default: return status;
            }
        },

        onSelectionChange: function (oEvent) {
            // this._selectedStatuses = this.byId("myMultiComboBoxs").getSelectedKeys();
            // let oDateRangeSelection = this.byId("dateTimePicker");
            // let startDate = oDateRangeSelection.getDateValue();
            // let endDate = oDateRangeSelection.getSecondDateValue();
            
            // this.getOwnerComponent().openBusyDialog();
            // this.filterData(startDate, endDate, this._selectedStatuses);


            this._selectedStatuses = this.byId("myMultiComboBoxs").getSelectedKeys();

            // Get the start and end date values
            let oDateRangeSelection = this.byId("dateTimePicker");
            let startDate = oDateRangeSelection.getDateValue();
            let endDate = oDateRangeSelection.getSecondDateValue();
            let oBarChartContainer = this.byId("barChartContainer");
            if (oBarChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToLineChart();
            }
            // Check if the Donut Chart is visible
            let oDonutChartContainer = this.byId("donutChartContainer");
            if (oDonutChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToPieChart();
            }
        
            // Open the busy dialog and filter data
            this.getOwnerComponent().openBusyDialog();
            this.filterData(startDate, endDate, this._selectedStatuses);
            
        },

        // onSelectionTenantChange: function (oEvent) {
        //     var aSelectedItems = oEvent.getSource().getSelectedItems();
        //     var aSelectedTenantIDs = aSelectedItems.map(function (oItem) {
        //         return oItem.getKey(); // Extract the 'key' which is the tenantID
        //     });

        //     this.getView().getModel("headerModel").setProperty("/tenantDetails", aSelectedTenantIDs);
        //     this.loadInstances();
        // },
        formatTime: function (timestamp) {
    //         // Example input: '2024-10-07T06:25'
    //         let date = new Date(timestamp);

    // // Define options to format the time
    //         let timeOptions = {
    //             hour: 'numeric',
    //             minute: 'numeric',
    //             hour12: true // Use 12-hour format with AM/PM
    //         };
    //         let formattedTime = date.toLocaleTimeString('default', timeOptions);
    //         let [datePart, timePart] = timestamp.split('T'); // Split into date and time
    //         let [year, month, day] = datePart.split('-'); // Split date into year, month, and day
    //         let [hours, minutes] = timePart.split(':'); // Split hours and minutes
        
    //         hours = parseInt(hours, 10); // Convert to integer for manipulation
    //         let ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    //         hours = hours % 12 || 12; // Convert to 12-hour format (0 should be 12)
    //         minutes = minutes.padStart(2, '0'); // Ensure minutes have leading zero
        
    //         // Format date to include month and day
    //         let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    //                           "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    //         let formattedDate = `${monthNames[parseInt(month) - 1]} ${day}, ${year.slice(-2)}`; // Format the date
        
    //         // return `${formattedDate} ${hours}:${minutes} ${ampm}`; // Return formatted date and time
    //         return ` ${hours}:${minutes} ${ampm}`;





        // Create a Date object from the timestamp, automatically adjusting to the device's local timezone
        let date = new Date(timestamp);
    
        // Define options to format the time
        let timeOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true // Use 12-hour format with AM/PM
        };
    
        // Define options to format the date
        // let dateOptions = {
        //     day: '2-digit',
        //     month: 'short', // Abbreviated month (e.g., Jan, Feb)
        //     year: '2-digit' // Last two digits of the year
        // };
    
        // Format the date and time according to local timezone
        // let formattedDate = date.toLocaleDateString('default', dateOptions);
        let formattedTime = date.toLocaleTimeString('default', timeOptions);
    
        // Combine formatted date and time
        return `${formattedTime}`;
    
    
        }, 
        formatDate: function(timestamp) {
            let date = new Date(timestamp);
            let dateOptions = {
                day: '2-digit',
                month: 'short'
            };
        
            // Format the date according to local timezone
            let formattedDate = date.toLocaleDateString('default', dateOptions);
        
            return `${formattedDate}`;
        },
        
        formatMonth: function(timestamp) {
            let date = new Date(timestamp);
            let monthOptions = {
                month: 'short',
                year: '2-digit'
            };
        
            // Format the month and year according to local timezone
            let formattedMonth = date.toLocaleDateString('default', monthOptions);
        
            return `${formattedMonth}`;
        },
        
        _updateDestination:function(aIds){
            var that = this;
            // this.getOwnerComponent().openBusyDialog();

            // var oView = this.getView();
            // var oTenant = oView.byId("valueHelpPopover");
            // var tenant = 'SBPATenant3%2CSBPATenant2%2CSBPATenant1'; 
        
            // var aSelectedItems = oTenant.getSelectedItems();
        
            // if (aSelectedItems.length === 0) {
            //     MessageToast.show("Please select at least one Tenant.");
            //     return;
            // }
        
            // var aSelectedIds = aSelectedItems.map(function(oSelectedItem) {
            //     return oSelectedItem.getBindingContext("instanceModel").getObject().id; 
            // });
        
            var payload = {
                "ID": aIds 
                
            }; 
            
        
            var oModel = this.getOwnerComponent().getModel("wfModel");
            var oListBinding = oModel.bindList("/UpdateDestination");  

            var oContext = oListBinding.create(payload, { bSkipRefresh: true });

            oContext.created().then(function() {

                // that._refreshInstanceModel();

                // var oInstanceModel = that.getView().getModel("instanceModel");
                // var currentData = oInstanceModel.getData();

                // var updatedData = currentData.filter(function(item) {
                //     return !aSelectedIds.includes(item.id); 
                // });

                // oInstanceModel.setProperty("/", updatedData);
                // oTenant.removeSelections();
                // oTenant.getBinding("items").refresh(true);  
                // MessageToast.show("Selected instances have been deleted.");
                // that.getOwnerComponent().closeBusyDialog();

            }).catch(function(oError) {
                console.error("Failed to update destinations:", oError);
                // MessageToast.show("Failed to update destinations.");
                that.getOwnerComponent().closeBusyDialog();

            });
        },



        _preSelectTokens: function () {
            var oView = this.getOwnerComponent();
            var oMultiInput = this.byId("multiInput");
        
            oView.getModel("wfModel").bindList("/Destinations").requestContexts(0, 10).then(function (aContexts) {
                var aSelectedTokens = [];
                var aIds = []; // Array to store IDs
        
                aContexts.forEach(function (oContext) {
                    var oData = oContext.getObject();
                    aSelectedTokens.push(new Token({
                        key: oData.dest_name,
                        text: oData.display_Name
                    }));
                    
             
                    aIds.push(oData.ID);
                });
        
                aSelectedTokens.forEach(function (oToken) {
                    oMultiInput.addToken(oToken);
                });
        
                
                var sIdsCommaSeparated = aIds.join(",");
        
                console.log("Comma-separated IDs:", sIdsCommaSeparated);
                
                // Optional: Store this string in a model or variable as per your requirement
                // this.getView().getModel("wfModel").setProperty("/SelectedIDs", sIdsCommaSeparated);

                this._updateDestination(aIds);
        
                this._loadInitialData();
            }.bind(this));
        },

        _loadInitialData: function () {
            var oMultiInput = this.byId("multiInput");
            var oMultiInputTokens = oMultiInput.getTokens();

            var aSelectedKeys = oMultiInputTokens.map(function (oToken) {
                return oToken.getKey();
            });

            this.loadData(aSelectedKeys);
        },

        onTokenUpdate: function (oEvent) {
            if (oEvent.getParameter("type") === "removed") {
                setTimeout(function () {
                    var oMultiInput = this.byId("multiInput");
        
                    var aRemainingTokens = oMultiInput.getTokens().map(function (oToken) {
                        return oToken.getKey();
                    });
        
                    this._remainingTokens = aRemainingTokens;
                    console.log("Remaining Tokens:", this._remainingTokens);
                    this.getOwnerComponent().openBusyDialog();
                    this.loadData(this._remainingTokens);
                    // Pass the selected IDs to the _updateDestinations function
                    // this._updateDestination(aIds);
                }.bind(this), 0); 
            }
        },    
        handleValueHelp: function (oEvent) {
            var oMultiInput = this.byId("multiInput");

            var oView = this.getView();
            var oMultiInputTokens = oMultiInput.getTokens();

            var aSelectedKeys = oMultiInputTokens.map(function (oToken) {
                return oToken.getKey();
            });
        
            if (!this._oPopover) {
                Fragment.load({
                    id: oView.getId(),
                    name: "automationhealthapp.Fragments.tenantsPopover",
                    controller: this
                }).then(function (oPopover) {
                    this._oPopover = oPopover;
                    oView.addDependent(this._oPopover);
                    this._loadDestinationsAndSync(aSelectedKeys, oEvent);
                }.bind(this));
            } else {
                this._loadDestinationsAndSync(aSelectedKeys, oEvent);
            }
        },
        
        _loadDestinationsAndSync: function (aSelectedKeys, oEvent) {
            var oList = this._oPopover.getContent()[0];
            oList.bindItems({
                path: "wfModel>/Destinations",
                template: new sap.m.StandardListItem({
                    title: "{wfModel>display_Name}",
                    selected: "{= ${wfModel>dest_name} === 'selected'}" 
                })
            });
      
            oList.attachUpdateFinished(function () {
                var aItems = oList.getItems();
        
                aItems.forEach(function (oItem) {
                    var sItemKey = oItem.getBindingContext("wfModel").getProperty("dest_name");
                    oItem.setSelected(aSelectedKeys.includes(sItemKey)); 
                });

                this._oPopover.openBy(oEvent.getSource());
            }.bind(this));
        },      
        _handlePopoverOk: function () {
            var oMultiInput = this.byId("multiInput");
            var oList = this._oPopover.getContent()[0]; 
            var aSelectedItems = oList.getSelectedItems();
            var aSelectedKeys = [];
            var aTokens = oMultiInput.getTokens();
            var aCurrentTokensKeys = aTokens.map(function (oToken) {
                return oToken.getKey();
            });
        
            // Array to store the OData.ID properties
            var aIds = [];
        
            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("wfModel");
                var oData = oContext.getObject();
                aSelectedKeys.push(oData.dest_name);
        
                // Add the OData.ID to the array
                if (oData.ID) {
                    aIds.push(oData.ID);  // Store OData.ID
                }
            });
        
            // Remove tokens from MultiInput that are not selected in the popover
            aCurrentTokensKeys.forEach(function (sTokenKey) {
                if (aSelectedKeys.indexOf(sTokenKey) === -1) {
                    var oTokenToRemove = oMultiInput.getTokens().find(function (oToken) {
                        return oToken.getKey() === sTokenKey;
                    });
                    oMultiInput.removeToken(oTokenToRemove);
                }
            });
        
            // Add the new tokens based on selected items
            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("wfModel");
                var oData = oContext.getObject();
                if (!aCurrentTokensKeys.includes(oData.dest_name)) {
                    oMultiInput.addToken(new Token({
                        key: oData.dest_name,
                        text: oData.display_Name
                    }));
                }
            });
        
            this._updateDestination(aIds);
            // Load data based on selected keys


           
        


            this.getOwnerComponent().openBusyDialog();

            let oBarChartContainer = this.byId("barChartContainer");
            if (oBarChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToLineChart();
            }
            // Check if the Donut Chart is visible
            let oDonutChartContainer = this.byId("donutChartContainer");
            if (oDonutChartContainer.getVisible()) {
                // Call the function to switch back to the Pie Chart
                this.onBackToPieChart();
            }
            this.loadData(aSelectedKeys);
        
            // Close the popover
            this._oPopover.close();
        },
        
        _handlePopoverCancel: function () {
            var oView = this.getView();
            var oMultiInput = this.byId("multiInput");
            var oMultiInputTokens = oMultiInput.getTokens();

            var aSelectedKeys = oMultiInputTokens.map(function (oToken) {
                return oToken.getKey();
            });

            var oList = this._oPopover.getContent()[0]; 
            var aItems = oList.getItems();

            aItems.forEach(function (oItem) {
                var sItemKey = oItem.getBindingContext("wfModel").getProperty("dest_name");

                if (aSelectedKeys.indexOf(sItemKey) === -1) {
                    oItem.setSelected(false); 
                }
            });

            this._oPopover.close();
        },
        _handleSelectionChange: function (oEvent) {
            var oList = this.byId("idList");
            var aSelectedItems = oList.getSelectedItems();
            var oOkButton = this.byId("OkId"); // Reference the OK button by its ID
        
            // Enable OK button if there are selected items, otherwise disable it
            oOkButton.setEnabled(aSelectedItems.length > 0);
        },
        loaderror: function() {
            // this.showBusyDialog();
            this.getOwnerComponent().openBusyDialog();
            var that= this;
            let oModel = this.getOwnerComponent().getModel("wfModel");
            let oBindList = oModel.bindList("/ErrorLogs");
        
            oBindList.requestContexts().then(function(aContexts) {
                let aErrorData = aContexts.map(oContext => oContext.getObject());
        
                let statusCounts = {};
                let errorMessages = {}; 
        
                aErrorData.forEach(item => {
                    if (item.statusCode) {
                        if (!statusCounts[item.statusCode]) {
                            statusCounts[item.statusCode] = 0;
                            errorMessages[item.statusCode] = item.errorMessage || "No error message available"; 
                        }
        
                        statusCounts[item.statusCode]++;
                    }
                });
        
                let aStatusCounts = Object.keys(statusCounts).map(statusCode => ({
                    statusCode: parseInt(statusCode),
                    count: statusCounts[statusCode],
                    errorMessage: errorMessages[statusCode] 
                }));
        
                let totalErrorCount = aErrorData.length;
        
                let oErrorCountModel = new sap.ui.model.json.JSONModel({
                    statusCounts: aStatusCounts,
                    totalCount: totalErrorCount
                });
        
                this.getView().setModel(oErrorCountModel, "errorCountModel");
                
                // this.getOwnerComponent().closeBusyDialog();
            }.bind(this)).catch(function(oError) {
                console.error("Error fetching error logs:", oError);
                this.getOwnerComponent().closeBusyDialog();
            }.bind(this));
        },    
        
        
            





        fetchAutomationDetails: async function(instancsIds, tenants) {
            // this.getOwnerComponent().openBusyDialog();
            var that = this,
                oModel = this.getOwnerComponent().getModel("wfModel"),
                totalExecutionTimeInSeconds = 0,
                allTenantData = {};
        
            const dateFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern: "MMM dd hh:mm a",
                calendarType: sap.ui.core.CalendarType.Gregorian
            });
        
            try {
                // Await the result of the requestContexts call to ensure it's completed before moving forward
                const aContexts = await oModel.bindList(`/automationDetails(tenants='${tenants}',instanceId='${instancsIds}')`)
                    .requestContexts();
        
                aContexts.forEach(oContext => {
                    let oData = oContext.getObject(),
                        tenant = oData.tenant,
                        instanceId = oData.instanceId;
        
                        if (Array.isArray(oData.automationDetails)) {
                            oData.automationDetails.forEach(automationDetail => {
                                // Add to totalExecutionTimeInSeconds only for completed status
                                if (automationDetail.status === "Completed") {
                                    totalExecutionTimeInSeconds += automationDetail.duration || 0;
                                }
        
                                if (automationDetail.startTime) {
                                    const startDate = new Date(automationDetail.startTime);
                                    automationDetail.executionDate = dateFormat.format(startDate);
                                }
        
                                automationDetail.tenant = tenant;
                                automationDetail.instanceId = instanceId;
        
                                allTenantData[tenant] = allTenantData[tenant] || [];
                                allTenantData[tenant].push(automationDetail);
                            });
                        }
                    });
        
                    var allFlattenedData = Object.values(allTenantData).flat();
                    that.originalData = allFlattenedData;
        
                    // Filter data for completed automation status
                    var completedStatusData = allFlattenedData.filter(function(automationDetail) {
                        return automationDetail.status === "Completed";
                    });
        
                    // Process failed data counts
                    let { failedCounts, totalFailedCount } = that.processFailedData(allFlattenedData);
        
                    // Get the existing model
                    var automationDetailsModel = that.getView().getModel("automationDetailsModel");
        
                    // Format the final total execution time to three decimal places
                    totalExecutionTimeInSeconds = parseFloat(totalExecutionTimeInSeconds.toFixed(3));
        
                // Update model properties
                automationDetailsModel.setProperty("/instances", allFlattenedData);
                automationDetailsModel.setProperty("/failedCounts", failedCounts);
                automationDetailsModel.setProperty("/totalFailedCount", totalFailedCount); 
                automationDetailsModel.setProperty("/totalExecutionTime", totalExecutionTimeInSeconds);
                automationDetailsModel.setProperty("/completedStatusData", completedStatusData); // Store completed data
        
                // Bind the updated model to VizFrame
                var oVizFrame = that.getView().byId("maxResponseTimeChart");
                oVizFrame.setModel(automationDetailsModel);
        
                // Call onDateChange after the data loading is fully completed
                this.onDateChange();
                that.getOwnerComponent().closeBusyDialog();
                // sap.m.MessageToast.show("Automation Details Loaded Successfully");
            } catch (error) {
                console.error("Error fetching automation details: ", error);
                // sap.m.MessageToast.show("Error Loading Automation Details");
            }
        },
                                     
        processFailedData: function(automationDetails, sameDay, withinMonth) {
            let failedCountByStartTime = {};
            let totalFailedCount = 0;
            let dateFormat;
        
            if (sameDay) {
                // Format by hour for same-day range
                dateFormat = sap.ui.core.format.DateFormat.getInstance({
                    pattern: "MMM dd hh:mm a", 
                    calendarType: sap.ui.core.CalendarType.Gregorian
                });
            } else if (withinMonth) {
                // Format by day for ranges within a month
                dateFormat = sap.ui.core.format.DateFormat.getInstance({
                    pattern: "MMM dd", 
                    calendarType: sap.ui.core.CalendarType.Gregorian
                });
            } else {
                // Format by month for ranges longer than a month
                dateFormat = sap.ui.core.format.DateFormat.getInstance({
                    pattern: "MMM yyyy", 
                    calendarType: sap.ui.core.CalendarType.Gregorian
                });
            }
        
            automationDetails.forEach(detail => {
                if (detail.status === 'Failed' && detail.startTime) {
                    const startTime = new Date(detail.startTime); 
                    const formattedStartTime = dateFormat.format(startTime);
        
                    if (!failedCountByStartTime[formattedStartTime]) {
                        failedCountByStartTime[formattedStartTime] = 0;
                    }
                    failedCountByStartTime[formattedStartTime]++;
                    totalFailedCount++;
                }
            });
        
            return { 
                failedCounts: Object.entries(failedCountByStartTime).map(([formattedStartTime, count]) => ({
                    startTime: formattedStartTime, 
                    count: count
                })), 
                totalFailedCount
            };
        },  

            
        _filterDataByDateRange: function(startDate, endDate) {
                        var that = this;
                        let allData = this.originalData;
                        let tenantWiseData = {};
                    
                        // Group data by tenant
                        allData.forEach(automationDetail => {
                            if (!tenantWiseData[automationDetail.tenant]) {
                                tenantWiseData[automationDetail.tenant] = [];
                            }
                            tenantWiseData[automationDetail.tenant].push(automationDetail);
                        });
                    
                        let filteredData = [];
                        for (const tenant in tenantWiseData) {
                            const tenantData = tenantWiseData[tenant].filter(function(automationDetail) {
                                const automationDate = new Date(automationDetail.startTime);
                                // Filter by date range and error condition
                                return automationDate >= startDate &&
                                    automationDate <= endDate &&
                                    !automationDetail.error; // Assuming error indicates failure
                            });
                            filteredData.push(...tenantData);
                        }
                    
                        // Determine date format based on date range
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const withinMonth = (endDate - startDate) / (1000 * 60 * 60 * 24) <= 31;
                        let dateFormat;
                    
                        if (sameDay) {
                            // Format by hour for same-day range
                            dateFormat = sap.ui.core.format.DateFormat.getInstance({
                                pattern: "MMM dd hh:mm a", 
                                calendarType: sap.ui.core.CalendarType.Gregorian
                            });
                        } else if (withinMonth) {
                            // Format by day for ranges within a month
                            dateFormat = sap.ui.core.format.DateFormat.getInstance({
                                pattern: "MMM dd", 
                                calendarType: sap.ui.core.CalendarType.Gregorian
                            });
                        } else {
                            // Format by month for ranges longer than a month
                            dateFormat = sap.ui.core.format.DateFormat.getInstance({
                                pattern: "MMM yyyy", 
                                calendarType: sap.ui.core.CalendarType.Gregorian
                            });
                        }
                    
                        // Apply formatted date to each instance based on date range
                        filteredData.forEach(instance => {
                            const date = new Date(instance.startTime);
                            instance.executionDate = dateFormat.format(date); // Add executionDate property with formatted date
                        });
                    
                        // Filter completed data within the date range
                        let completedStatusData = filteredData.filter(function(automationDetail) {
                            return automationDetail.status === "Completed";
                        });
                    
                        let totalExecutionTimeInSeconds = completedStatusData.reduce((total, automationDetail) => {
                            return total + Math.round((automationDetail.duration || 0) * 1000) / 1000;
                        }, 0);
                        totalExecutionTimeInSeconds = parseFloat(totalExecutionTimeInSeconds.toFixed(3));
                    
                        // Process failed counts based on the date range
                        let { failedCounts, totalFailedCount } = that.processFailedData(filteredData, sameDay, withinMonth);
                    
                        var automationDetailsModel = that.getView().getModel("automationDetailsModel");
                    
                        if (filteredData.length > 0) {
                            automationDetailsModel.setProperty("/instances", filteredData);
                            automationDetailsModel.setProperty("/totalExecutionTime", totalExecutionTimeInSeconds);
                            automationDetailsModel.setProperty("/completedStatusData", completedStatusData);
                            automationDetailsModel.setProperty("/failedCounts", failedCounts);
                            automationDetailsModel.setProperty("/totalFailedCount", totalFailedCount);
                    
                            // sap.m.MessageToast.show("Filtered Completed Automation Details Loaded Successfully");
                        } else {
                            automationDetailsModel.setProperty("/instances", []);
                            automationDetailsModel.setProperty("/totalExecutionTime", 0);
                            automationDetailsModel.setProperty("/failedCounts", []);
                            automationDetailsModel.setProperty("/totalFailedCount", 0);
                            automationDetailsModel.setProperty("/completedStatusData", []);
                    
                            // sap.m.MessageToast.show("No completed automation details found for the selected date range.");
                            // that.getOwnerComponent().closeBusyDialog();
                        }
                    },
                    onAfterRendering: function() {
                        var oTable = this.byId("statusTable");
                        if (!this._bEventAttached) {
                            oTable.attachEventOnce("updateFinished", function() {
                                oTable.getItems().forEach(function(oItem) {
                                    oItem.$().on("mouseenter", this.onCellHover.bind(this, oItem));
                                    oItem.$().on("mouseleave", this.onCellLeave.bind(this));
                                }.bind(this));
                                this._bEventAttached = true;
                            }.bind(this));
                        }   
                        
                        // var oBackButton = this.byId("bck2line");  // Assuming you have the back button with this ID
                        // if (oBackButton) {
                        //     // Make sure the back button is visible and enabled
                        //     oBackButton.setVisible(true);  // Ensure the button is visible
                        //     oBackButton.setEnabled(true);  // Ensure the button is enabled
                        // }

                        // var oBackButton = this.byId("bck2line");

                        // if (oBackButton) {
                        //     oBackButton.setVisible(true);  // Force visibility
                        //     oBackButton.setEnabled(true);  // Force enablement
                        // }
                    
                        // // Check if flip container is causing issues
                        // var oFlipContainer = this.byId("flipContainer");
                        // if (oFlipContainer && oFlipContainer.hasStyleClass("flipped")) {
                        //     oFlipContainer.removeStyleClass("flipped");  // Ensure it's in the correct state
                        // }
                    },

                    // onBeforeRendering: function () {
                    //     var oModel = this.getView().getModel();
                    //     if (oModel) {
                    //         oModel.refresh(true); // Refresh the model if necessary
                    //     }
                    // },
                    
                    onCellHover: function(oItem) {
                        var oContext = oItem.getBindingContext("errorCountModel");
                        if (oContext) {
                            var oData = oContext.getObject();
                            var errorMessage = oData.errorMessage || "No error message available";
        
                            if (!this._pErrorPopover) {
                                this._pErrorPopover = Fragment.load({
                                    id: this.getView().getId(),
                                    name: "automationhealthapp.Fragments.errorCodeMessage",
                                    controller: this
                                }).then(function(oPopover) {
                                    this.getView().addDependent(oPopover);
                                    return oPopover;
                                }.bind(this));
                            }
                    
                            this._pErrorPopover.then(function(oPopover) {
                                this.byId("popoverErrorMessage").setText(errorMessage);
                                oPopover.openBy(oItem);
                            }.bind(this));
                        } else {
                            console.warn("No context found for the hovered row.");
                        }
                    },
                    onCellLeave: function() {
                        if (this._pErrorPopover) {
                            this._pErrorPopover.then(function(oPopover) {
                                oPopover.close();
                            });
                        }
                    },




                    // onSelectLineChart: function (oEvent) {
                    //     var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                    //     var oVizFrame = this.getView().byId("idBarChart");
                    
                    //     if (oSelectedData && oSelectedData.length > 0) {
                    //         var selectedReading = oSelectedData[0].data.Timestamp;
                    
                    //         // Get the tenant data for the selected timestamp
                    //         var selectedTenantData = this._tenantData[selectedReading] || {};
                    
                    //         // Prepare the tenant data for the bar chart
                    //         var barData = Object.keys(selectedTenantData).map(function(tenant) {
                    //             return {
                    //                 Category: tenant,
                    //                 Value: selectedTenantData[tenant]
                    //             };
                    //         });
                    
                    //         // Check the maximum value from barData
                    //         var maxValue = Math.max(...barData.map(item => item.Value));
                    
                    //         // If the maximum value is <= 2, set the Y-axis range to be fixed, else make it dynamic
                    //         if (maxValue <= 2) {
                    //             this.updateBarYAxisRange(barData, 0, 4); // Fixed range between 0 and 4
                    //         } else {
                    //             oVizFrame.setVizProperties({
                    //                 "plotArea": {
                    //                     "primaryScale": {
                    //                         "fixedRange": false
                    //                     }
                    //                 }
                    //             });
                    //         }
                    
                    //         // Flip to bar chart and update the data
                    //         this._flipToBarChart(selectedReading);  // Flip to bar chart
                    //         this._updateBarChartData(barData);      // Pass the tenant data to the bar chart
                    //     } else {
                    //         console.warn("No data point selected");
                    //     }
                    // },



                    onSelectLineChart: function (oEvent) {
                        var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                        var oVizFrame = this.getView().byId("idBarChart");
                    
                        if (oSelectedData && oSelectedData.length > 0) {
                            var selectedReading = oSelectedData[0].data.Timestamp;
                    
                            // Get the tenant data for the selected timestamp
                            var selectedTenantData = this._tenantData[selectedReading] || {};
                    
                            // Prepare the tenant data for the bar chart
                            var barData = Object.keys(selectedTenantData).map(function (tenant) {
                                return {
                                    Category: tenant,
                                    Value: selectedTenantData[tenant].count // Use the count for the bar chart value
                                };
                            });
                    
                            // Prepare the tenant IDs mapping
                            var tenantIds = Object.keys(selectedTenantData).reduce(function (acc, tenant) {
                                acc[tenant] = selectedTenantData[tenant].ids; // Store IDs for each tenant
                                return acc;
                            }, {});
                    
                            // Check the maximum value from barData
                            var maxValue = Math.max(...barData.map(item => item.Value));
                    
                            // If the maximum value is <= 2, set the Y-axis range to be fixed, else make it dynamic
                            if (maxValue <= 2) {
                                this.updateBarYAxisRange(barData, 0, 4); // Fixed range between 0 and 4
                            } else {
                                oVizFrame.setVizProperties({
                                    "plotArea": {
                                        "primaryScale": {
                                            "fixedRange": false
                                        }
                                    }
                                });
                            }
                    
                            // Flip to bar chart and update the data
                            this._flipToBarChart(selectedReading);  // Flip to bar chart
                            this._updateBarChartData(barData);      // Pass the tenant data to the bar chart
                    
                            // Bind the tenant IDs to the bar chart for later use
                            oVizFrame.data("tenantIds", tenantIds); // Attach tenant IDs to the VizFrame using custom data
                        } else {
                            console.warn("No data point selected");
                        }
                    },
                    

                    // onSelectLineChart: function (oEvent) {
                    //     var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                    //     var oVizFrame = this.getView().byId("idBarChart");
                    
                    //     if (oSelectedData && oSelectedData.length > 0) {
                    //         var selectedReading = oSelectedData[0].data.Timestamp;
                    
                    //         // Get the tenant data for the selected timestamp
                    //         var selectedTenantData = this._tenantData[selectedReading] || {};
                    
                    //         // Prepare the tenant data for the bar chart
                    //         var barData = Object.keys(selectedTenantData).map(function (tenant) {
                    //             return {
                    //                 Category: tenant,
                    //                 Value: selectedTenantData[tenant].count // Use the count for the bar chart value
                    //             };
                    //         });



                    
                    //         this._selectedCategory = {}; // Reset previous data
                    //         this._selectedIds = {};      // Reset previous data
                    
                    //         // Populate _selectedCategory and _selectedIds
                    //         Object.keys(selectedTenantData).forEach(function (tenant) {
                    //             this._selectedCategory[tenant] = tenant;             // Store the tenant as the category
                    //             this._selectedIds[tenant] = selectedTenantData[tenant].ids; // Store IDs for each tenant
                    //         }.bind(this));



                    
                    //         // Check the maximum value from barData
                    //         var maxValue = Math.max(...barData.map(item => item.Value));
                    
                    //         // If the maximum value is <= 2, set the Y-axis range to be fixed, else make it dynamic
                    //         if (maxValue <= 2) {
                    //             this.updateBarYAxisRange(barData, 0, 4); // Fixed range between 0 and 4
                    //         } else {
                    //             oVizFrame.setVizProperties({
                    //                 "plotArea": {
                    //                     "primaryScale": {
                    //                         "fixedRange": false
                    //                     }
                    //                 }
                    //             });
                    //         }
                    
                    //         // Flip to bar chart and update the data
                    //         this._flipToBarChart(selectedReading);  // Flip to bar chart
                    //         this._updateBarChartData(barData);      // Pass the tenant data to the bar chart
                    //     } else {
                    //         console.warn("No data point selected");
                    //     }
                    // },
                    
                    
    
    _flipToBarChart: function (selectedReading) {
        var oFlipContainer = this.byId("flipContainer");
        // var oLineChartContainer = this.byId("lineChartContainer");
        var oBarChartContainer = this.byId("barChartContainer");
    
        // Add the 'flipped' class for animation
        oFlipContainer.addStyleClass("flipped");
    
        // Delay setting the visibility to avoid interrupting the animation
        setTimeout(function () {
            // oLineChartContainer.setVisible(false);
            oBarChartContainer.setVisible(true);
        }, 400); // Match the CSS transition duration
    },
    

    _updateBarChartData: function (barData) {
        var oBarModel = this.getView().getModel("barModel");
        if (!oBarModel) {
            console.error("barModel is not defined or not set on the view.");
            return;
        }
    
        // Set the bar chart data
        oBarModel.setData({
            BarData: barData
        });
    },
    




                    onBackToLineChart: function () {
                        var oFlipContainer = this.byId("flipContainer");
                        var oLineChartContainer = this.byId("lineChartContainer");
                        var oBarChartContainer = this.byId("barChartContainer");
                    
                        // Remove the 'flipped' class for animation
                        oFlipContainer.removeStyleClass("flipped");
                    
                        // Delay visibility changes for seamless animation
                        setTimeout(function () {
                            oBarChartContainer.setVisible(false);
                            oLineChartContainer.setVisible(true);
                        }, 600); // Match the CSS transition duration
                    },
                    

                    // onBackToLineChart: function () {
                    //     var oFlipContainer = this.byId("flipContainer");
                    //     var oLineChartContainer = this.byId("lineChartContainer");
                    //     var oBarChartContainer = this.byId("barChartContainer");
                    //     var oBackButton = this.byId("bck2line");  // Ensure the back button is part of the view
                    
                    //     // Remove the 'flipped' class for animation
                    //     oFlipContainer.removeStyleClass("flipped");
                    
                    //     // Ensure the back button is visible when navigating back
                    //     if (oBackButton) {
                    //         oBackButton.setVisible(true);
                    //         oBackButton.setEnabled(true);  // Make sure it is enabled
                    //     }
                    
                    //     // Delay visibility changes for seamless animation
                    //     setTimeout(function () {
                    //         oBarChartContainer.setVisible(false);
                    //         oLineChartContainer.setVisible(true);
                    //     }, 600); // Match the CSS transition duration
                    // },
                    
                    
                    
                    
                    onPieSelect: function (oEvent) {
                        var oSelectedData = oEvent.getParameter("data"); // Get the selected Pie chart data point
                    
                        if (oSelectedData && oSelectedData.length > 0) {
                            var selectedStatus = oSelectedData[0].data.ProcessName;
                    
                            // Ensure _tenantDataByStatus is defined
                            if (!this._tenantDataByStatus) {
                                console.error("tenantDataByStatus is not available");
                                return;
                            }
                    
                            var tenantDataByStatus = this._tenantDataByStatus[selectedStatus] || {};
                    
                            // Prepare tenant data for the Donut chart
                            var donutData = Object.keys(tenantDataByStatus).map(function (tenant) {
                                return {
                                    Category: tenant,
                                    Value: tenantDataByStatus[tenant]
                                };
                            });
                    
                            // Flip to donut chart
                            this._flipToDonutChart(selectedStatus);
                    
                            // Update donut chart with tenant data
                            this._updateDonutChartData(donutData);
                    
                            // Get the Donut chart viz frame
                            var oVizDonutFrame = this.getView().byId("idDonutChart");
                    
                            // Dynamically set the title of the Donut chart
                            oVizDonutFrame.setVizProperties({
                                title: {
                                    visible: true,
                                    text: "Tenant-wise '" + selectedStatus + "' Process Visualization"  // Add selectedStatus to title
                                }
                            });
                        } else {
                            console.warn("No data point selected");
                        }
                    },
                    
                    
                     

                    _flipToDonutChart: function (selectedReading) {
                        var oFlipContainer = this.byId("flippContainer");
                        // var oLineChartContainer = this.byId("lineChartContainer");
                        var oDonutChartContainer = this.byId("donutChartContainer");
                    
                        // Add the 'flipped' class for animation
                        oFlipContainer.addStyleClass("flipped");
                    
                        // Delay setting the visibility to avoid interrupting the animation
                        setTimeout(function () {
                            // oLineChartContainer.setVisible(false);
                            oDonutChartContainer.setVisible(true);
                        }, 300); // Match the CSS transition duration
                    },
                    
                    _updateDonutChartData: function (donutData) {
                        var oDonutModel = this.getView().getModel("donutModel");
                        if (!oDonutModel) {
                            console.error("donutModel is not defined or not set on the view.");
                            return;
                        }
                    
                        // Set the donut chart data
                        oDonutModel.setData({
                            DonutData: donutData
                        });
                    },
                    
                    
                    onBackToPieChart:function()
                    {
                        var oFlipContainer = this.byId("flippContainer");
                        var oPieChartContainer = this.byId("pieChartContainer");
                        var oDonutChartContainer = this.byId("donutChartContainer");
                    
                        // Remove the 'flipped' class for animation
                        oFlipContainer.removeStyleClass("flipped");
                    
                        // Delay visibility changes for seamless animation
                        setTimeout(function () {
                            oDonutChartContainer.setVisible(false);
                            oPieChartContainer.setVisible(true);
                        }, 600); // Match the CSS transition duration
                    },

                    updateBarYAxisRange: function (barData, min, max) {
                        var oVizFrame = this.getView().byId("idBarChart"); // Assuming the bar chart's ID is idBarChart
                    
                        var oVizProperties = {
                            "plotArea": {
                                "dataLabel": {
                                    "visible": true
                                },
                                "primaryScale": {
                                    "fixedRange": true,  // Set the fixed range based on value check
                                    "minValue": min,     // Min value for Y-axis
                                    "maxValue": max      // Max value for Y-axis
                                }
                            }
                        };
                    
                        oVizFrame.setVizProperties(oVizProperties);
                    },
                    


                    // onSelectBarChart:function(){    
                    //     var oRouter = this.getOwnerComponent().getRouter();
                    //     oRouter.navTo("selectedprocessdetails");
                    //             }


                    // onSelectBarChart: function (oEvent) {
                    //     var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                    
                    //     if (oSelectedData && oSelectedData.length > 0) {
                    //         // Ensure data exists and contains the 'Category' property
                    //         var selectedCategory = oSelectedData[0]?.data?.Category; // Safely access the selected category
                    
                    //         if (selectedCategory) {
                    //             // Retrieve IDs for the selected category (tenant)
                    //             var selectedIds = this._selectedIds[selectedCategory];
                    
                    //             if (selectedIds) {
                    //                 console.log("Selected Tenant:", selectedCategory);
                    //                 console.log("Process IDs:", selectedIds);
                    
                    //                 // Perform any additional logic with the selected IDs
                    //             } else {
                    //                 console.warn("No IDs found for the selected category:", selectedCategory);
                    //             }
                    //         } else {
                    //             console.warn("No valid category found in the selected data.");
                    //         }
                    //     } else {
                    //         console.warn("No data point selected in bar chart");
                    //     }
                    // }
                    


                    // onSelectBarChart: function (oEvent) {
                    //     var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                    
                    //     if (oSelectedData && oSelectedData.length > 0) {
                    //         var selectedCategory = oSelectedData[0]?.data?.Category; // Safely access the selected category
                    
                    //         if (selectedCategory && this._selectedIds[selectedCategory]) {
                    //             var selectedIds = this._selectedIds[selectedCategory]; // Access IDs using the global variable
                    
                    //             console.log("Selected Tenant:", selectedCategory);
                    //             console.log("Process IDs:", selectedIds);
                    
                    //             // Perform any additional logic with the selected IDs
                    //         } else {
                    //             console.warn("No IDs found for the selected category:", selectedCategory);
                    //         }
                    //     } else {
                    //         console.warn("No data point selected in bar chart");
                    //     }
                    // }


                    // onSelectBarChart: function (oEvent) {
                    //     var oSelectedData = oEvent.getParameter("data");
                    
                    //     if (oSelectedData && oSelectedData.length > 0) {
                    //         var oVizFrame = this.getView().byId("idBarChart");
                    //         var tenantIds = oVizFrame.data("tenantIds"); 
                    
                    //         var selectedTenant = oSelectedData[0].data.Tenant;
                    //         var selectedIds = tenantIds[selectedTenant];
                            
                    //         var oRouter = this.getOwnerComponent().getRouter();
                    //         oRouter.navTo("selectedprocessdetails", { 
                    //             Tenant: selectedTenant,
                    //             IDs: selectedIds
                    //         });
                    
                    //         // Reset the back button when navigating away from the bar chart
                    //         var oBackButton = this.byId("backButton");
                    //         if (oBackButton) {
                    //             oBackButton.setVisible(true);  // Ensure it's visible
                    //             oBackButton.setEnabled(true);  // Ensure it's enabled
                    //         }
                    //     }
                    // },
                    



                    onSelectBarChart: function (oEvent) {
                        var oSelectedData = oEvent.getParameter("data"); // Get the selected data points
                    
                        if (oSelectedData && oSelectedData.length > 0) {
                            var oVizFrame = this.getView().byId("idBarChart");
                            var tenantIds = oVizFrame.data("tenantIds"); // Retrieve tenant IDs from the VizFrame


                            var selectedTenant = oSelectedData[0].data.Tenant;
                            var selectedIds = tenantIds[selectedTenant];
                            
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("selectedprocessdetails", { 
                                Tenant: selectedTenant ,
                                IDs: selectedIds });


                    
                        //     var selectedCategory = oSelectedData[0]?.data?.Category; // Safely access the selected category
                    
                        //     if (selectedCategory && tenantIds[selectedCategory]) {
                        //         var selectedIds = tenantIds[selectedCategory]; // Access IDs using the stored data
                    
                        //         console.log("Selected Tenant:", selectedCategory);
                        //         console.log("Process IDs:", selectedIds);
                    
                        //         // Perform any additional logic with the selected IDs
                        //     } else {
                        //         console.warn("No IDs found for the selected category:", selectedCategory);
                        //     }
                        // } else {
                            console.warn("No data point selected in bar chart");
                        }
                    },                  


                });
            
        });    