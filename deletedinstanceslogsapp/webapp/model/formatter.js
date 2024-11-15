sap.ui.define(["sap/ui/core/ValueState"], (ValueState) => {
    "use strict";

    return {
        statusColorFormat(sStatus) {
            switch (sStatus) {
                case "deleted":
                    return ValueState.Error; // Resolves directly to `ValueState.Error`
                default:
                    return ValueState.Success; // Resolves directly to `ValueState.Success`
            }
        }
    };
});