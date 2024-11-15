sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
function (Controller) {
    "use strict";

    return Controller.extend("destinationapp.controller.destinationView", {
        onInit: function () {
            var destModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(destModel, "destModel");
                this.readCreatedFlag();
                var createData = {
                    "dest_url": "",
                    "client_ID": "",
                    "client_secret": "",
                    "token_srv_url": ""
                  }
                // var flagData = {
                //         "dest_url": true,
                //         "client_ID": true,
                //         "client_secret": true,
                //         "token_srv_url": true
                // }
                this.getView().getModel("destModel").setProperty("/createDestinationData", createData);
                // this.getView().getModel("destModel").setProperty("/enabledData", flagData);

            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("RouteDestinationView").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(oEvent) {
			var destID = window.decodeURIComponent(oEvent.getParameter("arguments").ID);
            this.onRead(destID);
            this.readSaveEditFlag();
		},

        readCreatedFlag: function() {
            var flagData = {
                "dest_url": true,
                "client_ID": true,
                "client_secret": true,
                "token_srv_url": true,
                "btnSave": false,
                "btnEdit": false,
                "btnCreate": true,
                "btnNew": false
            }
            this.getView().getModel("destModel").setProperty("/enabledData", flagData);
        },

        readSaveEditFlag: function() {
            var flagData = {
                "dest_url": false,
                "client_ID": false,
                "client_secret": false,
                "token_srv_url": false,
                "btnSave": true,
                "btnEdit": true,
                "btnCreate": false,
                "btnNew": true
            }
            this.getView().getModel("destModel").setProperty("/enabledData", flagData);
        },

        onClickNew: function () {
            var createData = {
                "ID": "",
                "dest_name": "",
                "display_Name": "", 
                "dest_url": "",
                "client_ID": "",
                "client_secret": "",
                "token_srv_url": ""
              }
            this.getView().getModel("destModel").setProperty("/createDestinationData", createData);
            this.readCreatedFlag();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Master");
        },

        onRead: function (destID) {
            var oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, parseInt(destID));
            var oListBinding = this.getOwnerComponent().getModel().bindList("/Destinations", undefined, undefined, [oFilter], undefined);  //params : sPath, oContext?, vSorters?, vFilters?, mParameters?
              
               oListBinding.requestContexts(0,99999).then((aContexts)=>{
                   var aData = aContexts.map((oContext)=>oContext.getObject());
                   if(aData && aData.length > 0){   
                    function cleanOndemandURL(url) {
                        const ondemandString = ".ondemand.com";
                        const index = url.indexOf(ondemandString);
                        if (index !== -1) {
                            // Check if there's anything after '.ondemand.com' and remove it
                            return url.substring(0, index + ondemandString.length);  // Keep '.ondemand.com' intact
                        }
                        return url;
                    }
            
                    // Modify the dest_url and token_srv_url if needed
                    aData[0].dest_url = cleanOndemandURL(aData[0].dest_url);
                    aData[0].token_srv_url = cleanOndemandURL(aData[0].token_srv_url);
            
                    // Set the filtered and cleaned data to the local JSON model
                    this.getView().getModel("destModel").setProperty("/createDestinationData", aData[0]);
                   }
               }).catch((oErr)=>{
               });
        },

        onEditDestination: function () {
            var flagData = {
                "dest_url": true,
                "client_ID": true,
                "client_secret": true,
                "token_srv_url": true,
                "btnSave": true,
                "btnEdit": false,
                "btnCreate": false,
                "btnNew": true
            }
            this.getView().getModel("destModel").setProperty("/enabledData", flagData);
            // this.readSaveEditFlag();
        },

        onSaveDestination: function () {
            

            var createDestinationData = this.getView().getModel("destModel").getProperty("/createDestinationData");
            if (!this.onValidate(createDestinationData)) {
                // Validation failed, stop processing
                return;
            }
            var oListBinding = this.getOwnerComponent().getModel().bindList("/UpdateEntityDestination", undefined, undefined, undefined, undefined);  //params : sPath, oContext?, vSorters?, vFilters?, mParameters?
            var payload = {
                "ID": parseInt(createDestinationData.ID),
                "dest_name": createDestinationData.dest_name,
                "display_Name": createDestinationData.display_Name, 
                "client_ID": createDestinationData.client_ID,
                "token_srv_url": createDestinationData.token_srv_url + '/oauth/token',
                "dest_url": createDestinationData.dest_url + '/public/workflow/rest/v1',
                "client_secret": createDestinationData.client_secret
            };

            var oContext =
                    oListBinding.create(payload, {
                        bSkipRefresh: true
                    });
                oContext.created().then(function (odata) {
                    this.readSaveEditFlag();
                    debugger;
                }, function (oError) { });


        },

        onCreateDestination: function () {
            
            var createDestinationData = this.getView().getModel("destModel").getProperty("/createDestinationData");
            if (!this.onValidate(createDestinationData)) {
                // Validation failed, stop processing
                return;
            }
            var oListBinding = this.getOwnerComponent().getModel().bindList("/CreateDestination", undefined, undefined, undefined, undefined);  //params : sPath, oContext?, vSorters?, vFilters?, mParameters?
            var payload = {
                "client_ID": createDestinationData.client_ID,
                "token_srv_url": createDestinationData.token_srv_url + '/oauth/token',
                "dest_url": createDestinationData.dest_url + '/public/workflow/rest/v1',
                "client_secret": createDestinationData.client_secret
            };

            var oContext =
                    oListBinding.create(payload, {
                        bSkipRefresh: true
                    });
                oContext.created().then(function (odata) {
                    this.readCreatedFlag();
                    debugger;
                }, function (oError) { });

        },

        onValidate: function () {
            var isValid = true;
        
            // Access the input fields by their IDs
            var oClientIDInput = this.byId("clientIDInput"); // Assuming you assigned IDs to your inputs
            var oClientSecretInput = this.byId("clientSecretInput");
            var oTokenURLInput = this.byId("tokenSrvURLInput");
            var oDestURLInput = this.byId("destURLInput");
        
            // Reset ValueStates
            oClientIDInput.setValueState("None");
            oClientSecretInput.setValueState("None");
            oTokenURLInput.setValueState("None");
            oDestURLInput.setValueState("None");
        
            // Validate Client ID
            var clientID = oClientIDInput.getValue();
            if (!clientID) {
                isValid = false;
                oClientIDInput.setValueState("Error");
                oClientIDInput.setValueStateText("Client ID cannot be empty.");
            }
        
            // Validate Client Secret
            var clientSecret = oClientSecretInput.getValue();
            if (!clientSecret) {
                isValid = false;
                oClientSecretInput.setValueState("Error");
                oClientSecretInput.setValueStateText("Client Secret cannot be empty.");
            }
        
            // Validate Token Service URL
            var tokenSrvURL = oTokenURLInput.getValue();
            if (!tokenSrvURL) {
                isValid = false;
                oTokenURLInput.setValueState("Error");
                oTokenURLInput.setValueStateText("Token Service URL cannot be empty.");
            } else if (!tokenSrvURL.endsWith(".ondemand.com")) {
                isValid = false;
                oTokenURLInput.setValueState("Error");
                oTokenURLInput.setValueStateText("Token Service URL must end with '.ondemand.com'.");
            }
        
            // Validate Destination URL
            var destURL = oDestURLInput.getValue();
            if (!destURL) {
                isValid = false;
                oDestURLInput.setValueState("Error");
                oDestURLInput.setValueStateText("Destination URL cannot be empty.");
            } else if (!destURL.endsWith(".ondemand.com")) {
                isValid = false;
                oDestURLInput.setValueState("Error");
                oDestURLInput.setValueStateText("Destination URL must end with '.ondemand.com'.");
            }
        
            return isValid;
        }
        

        // onTenantSelectionChange: function (oEvent) {
        //     // Get the selected items from the MultiComboBox
        //     var aSelectedItems = oEvent.getSource().getSelectedItems();
        
        //     // Extract the tenantIDs from the selected items
        //     var aSelectedTenantIDs = aSelectedItems.map(function (oItem) {
        //         return oItem.getKey();  // Extract the 'key' which is the tenantID
        //     });
        
        //     // Store the selected tenantIDs in a model or directly use them
        //     this.getModel("destModel").setProperty("/SelectedTenantIDs", aSelectedTenantIDs);
            
        // },

        // onUpdate: function () {
        //     var oListBinding = this.getOwnerComponent().getModel().bindList("/updateDestination", undefined, undefined, undefined, undefined);
        
        //     // Get all destinations from the model
        //     var aDestinations = this.getModel("destModel").getProperty("/DestinationDetails");
        
        //     // Retrieve the selected tenant IDs from the model
        //     var aSelectedTenantIDs = this.getModel("destModel").getProperty("/SelectedTenantIDs");  // These are selected tenant IDs like "acdea487trial"
        
        //     // Filter destinations by SBPA-related URLs
        //     var aSBPADestinations = aDestinations.filter((destination) => {
        //         return destination.tokenServiceURL.includes('workflow/rest/v1');  // Filter logic for SBPA URL pattern
        //     });
        
        //     // Counter for SBPATenant naming
        //     var iTenantCounter = 1;
        
        //     // Loop through filtered SBPA destinations
        //     aSBPADestinations.forEach((destination) => {
        //         // Check if tokenServiceURL includes any tenant ID from aSelectedTenantIDs
        //         var bTenantMatched = aSelectedTenantIDs.some((tenantID) => {
        //             return destination.tokenServiceURL.includes(tenantID);
        //         });
        
        //         if (bTenantMatched) {
        //             // If tenant is matched, rename to SBPATenant1, SBPATenant2, etc.
        //             destination.Name = `SBPATenant${iTenantCounter}`;
        //             iTenantCounter++;
        //         } else {
        //             // If no tenant is matched, rename to SBPATest + part of tokenServiceURL (e.g., "acdea487trial")
        //             var tokenPart = destination.tokenServiceURL.match(/(?:https:\/\/)([^\.]+)/)[1];  // Extract tenant ID from tokenServiceURL
        //             destination.Name = `SBPATest${tokenPart}`;
        //         }
        
        //         // Prepare the payload for the update
        //         var payload = {
        //             "Type": destination.Type,
        //             "clientId": destination.clientId,
        //             "HTML5DynamicDestination": destination.HTML5DynamicDestination,
        //             "Authentication": destination.Authentication,
        //             "Name": destination.Name,  // Updated name
        //             "WebIDEEnabled": destination.WebIDEEnabled,
        //             "tokenServiceURL": destination.tokenServiceURL,
        //             "ProxyType": destination.ProxyType,
        //             "URL": destination.URL,
        //             "tokenServiceURLType": destination.tokenServiceURLType,
        //             "clientSecret": destination.clientSecret
        //         };
        
        //         // Perform the PATCH call to update the destination
        //         // var oContext = oListBinding.create(payload, {
        //         //     bSkipRefresh: true
        //         // });
        
        //         // oContext.created().then(function () {
        //         //     debugger;  // You can add a success message here or handle it accordingly
        //         // }, function (oError) {
        //         //     console.error("Error updating destination:", oError);  // Handle error
        //         // });
        //     });
        // },
        
        

        // onUpdate: function () {
        //     var oModel = this.getOwnerComponent().getModel();
        //     var oListBinding = oModel.bindList("/updateDestination", undefined, undefined, undefined, undefined);  //params : sPath, oContext?, vSorters?, vFilters?, mParameters?
        
        //     // Fetch all destinations first
        //     var aDestinations = this.getView().getModel("destModel").getProperty("/DestinationDetails");
        
        //     // Iterate over all destinations
        //     aDestinations.forEach((destination, index) => {
        //         // Check if tokenServiceURL contains 'acdea487trial'
        //         if (destination.tokenServiceURL) {
        //             if (destination.tokenServiceURL.includes('acdea487trial')) {
        //             // Check if the name contains SBPATenant1 to SBPATenant10
        //                 if (destination.Name.match(/SBPATenant[1-9]$|SBPATenant10$/)) {
        //                     // Update the name to SBPATest1, SBPATest2, etc.
        //                     var tokenServiceURLParts = destination.tokenServiceURL.split('/');
        //                     var tenantIdentifier = tokenServiceURLParts[2].split('.')[0]; // Extract 'acdea487trial' from the URL

        //                     // Set the new name as "SBPATest" + tenant identifier
        //                     var newName = "SBPATest" + tenantIdentifier;
        //                     var updatedPayload = {
        //                         "Type": "HTTP",
        //                         "clientId": destination.clientId,
        //                         "HTML5DynamicDestination": true,
        //                         "Authentication": "NoAuthentication",
        //                         "Name": newName, // Updated name
        //                         "WebIDEEnabled": true,
        //                         "tokenServiceURL": destination.tokenServiceURL,
        //                         "ProxyType": destination.ProxyType,
        //                         "URL": destination.URL,
        //                         "tokenServiceURLType": destination.tokenServiceURLType,
        //                         "clientSecret": destination.clientSecret
        //                     };
            
        //                     // PATCH call to update the destination name
        //                     var oContext = oListBinding.create(updatedPayload, {
        //                         bSkipRefresh: true
        //                     });
            
        //                     // oContext.created().then(() => {
        //                     //     sap.m.MessageToast.show(`Successfully updated ${newName}`);
        //                     // }).catch((oError) => {
        //                     //     sap.m.MessageBox.error(`Error updating destination: ${oError.message}`);
        //                     // });
        //                 }
        //             }
        //         }
        //     });
        // }
        
    });
});
