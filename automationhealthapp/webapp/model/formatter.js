sap.ui.define([], function () {
    "use strict";

    return {

        formatDate: function(Timestamp){
            if (!Timestamp) {
                return "";
            }
            
            // Create a Date object from the timestamp
            var time = new Date(Timestamp);
            
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



    };
});