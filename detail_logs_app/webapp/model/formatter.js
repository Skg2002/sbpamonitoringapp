sap.ui.define([], function () {
    "use strict";

    return {
        
        onAdd: function(Status) {
            switch (Status) {
                // case "RUNNING":
                //     return sap.ui.core.ValueState.Success; // Green
                // case "ERRONEOUS":
                //     return sap.ui.core.ValueState.Error;   // Red
                // case "READY":
                //     return sap.ui.core.ValueState.Information; // Blue
                // default:
                //     return sap.ui.core.ValueState.None; // Default state


                    case "RUNNING": 
                        return "Indication15";
                    case "READY": 
                        return "Indication15";
                    case "RESERVED": 
                        return "Indication15";
                    case "COMPLETED":
                        return "Indication14";
                    case "CANCELED":
                        return "Indication20"; 
                    case "SUSPENDED":
                        return "Indication13";   
                    case "ERRONEOUS": 
                        return "Indication12";  
                    default:
                        return "Indication19";
            }
        },


      
        formatDate: function(startedAt){
            if (!startedAt) {
                return "";
            }
            
            // Create a Date object from the timestamp
            var time = new Date(startedAt);
            
            // Extract date components
            var day = time.getDate();
            var month = time.getMonth(); // Note: getMonth() returns 0 for January, 1 for February, etc.
            var year = time.getFullYear();
            
            // Extract time components      
            var hours = time.getHours();
            var minutes = time.getMinutes(); 
            var seconds = time.getSeconds(); 
            
            // Convert 24-hour format to 12-hour format    
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'

            // Format the month name (short format, like "Jan", "Feb", etc.)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var monthName = monthNames[month];

            // Add leading zeroes to day, minutes, and seconds if needed
            day = day < 10 ? '0' + day : day;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // Construct the formatted date string
            var formattedDate = monthName + " " + day + ", " + year + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;

            return formattedDate;


        
        },
        

        formatdate: function(timestamp){
            if (!timestamp) {
                return "";
            }
            
            // Create a Date object from the timestamp
            var time = new Date(timestamp);
            
            // Extract date components
            var day = time.getDate();
            var month = time.getMonth(); // Note: getMonth() returns 0 for January, 1 for February, etc.
            var year = time.getFullYear();
            
            // Extract time components      
            var hours = time.getHours();
            var minutes = time.getMinutes(); 
            var seconds = time.getSeconds(); 
            
            // Convert 24-hour format to 12-hour format    
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'

            // Format the month name (short format, like "Jan", "Feb", etc.)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var monthName = monthNames[month];

            // Add leading zeroes to day, minutes, and seconds if needed
            day = day < 10 ? '0' + day : day;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // Construct the formatted date string
            var formattedDate = monthName + " " + day + ", " + year + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;

            return formattedDate;


        
        },



        convertDurationToHours: function (duration) {
            // Example input: "146h 3m 16s"
            var regex = /(\d+)h (\d+)m (\d+)s/;
            var matches = regex.exec(duration);
            
            if (matches) {
                var hours = parseInt(matches[1], 10);
                var minutes = parseInt(matches[2], 10);
                var seconds = parseInt(matches[3], 10);

                // Convert everything to hours (you can also return total minutes or seconds if preferred)
                return hours + minutes / 60 + seconds / 3600;
            }
            return 0; // Default in case of an error or invalid input
        },
           

        // formatMessage: function(type, userId, subject) {
        //     console.log("Type:", type, "UserId:", userId, "Subject:", subject); 
        //     const quotedSubject = "${subject}";
        
        //     if (type === "WORKFLOW_STARTED") {
        //         return userId + " started the instance";
        //     } else if(type === "EXCLUSIVE_GATEWAY_REACHED"){
        //         return quotedSubject + " reached";
        //     } else if (type === "AUTOMATIONTASK_CREATED") {
        //         return quotedSubject + " started";
        //     } else if (type === "WORKFLOW_SUSPENDED") { 
        //         return userId + " put the instance on hold";
        //     } else if (type === "WORKFLOW_RESUMED") {
        //         return userId + " resumed the instance";
        //     } else if (type === "WORKFLOW_CONTINUED") {
        //         return userId + " retried the instance";
        //     } else if (type === "WORKFLOW_CANCELED") {
        //         return userId + " canceled the instance";
        //     } else if (type === "AUTOMATIONTASK_COMPLETED") {
        //         return quotedSubject + " completed successfully";
        //     } else if (type === "AUTOMATIONTASK_FAILED") {
        //         return quotedSubject + " failed";
        //     } else if(type === "USERTASK_CREATED"){
        //         return "Task " + quotedSubject + " available";
        //     } else if(type === "USERTASK_COMPLETED"){
        //         return userId + " completed the task " + quotedSubject;
        //     } else if (type === "WORKFLOW_COMPLETED") {
        //         return "Instance completed successfully";
        //     } else if (type === "REFERENCED_SUBFLOW_STARTED") {
        //         return "Referenced subflow " + quotedSubject + " is started";
        //     } else if (type === "REFERENCED_SUBFLOW_COMPLETED") {
        //         return "Referenced subflow " + quotedSubject + " completed successfully";
        //     } else if(type === "USERTASK_PATCHED_BY_ADMIN"){
        //         return userId + " updated the details of task " + quotedSubject;
        //     } else {
        //         return "Unknown event type: " + type; 
        //     } 
        // }
    };
});
