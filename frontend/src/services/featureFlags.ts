import flagsmith from 'flagsmith';

// Initialize Flagsmith
flagsmith.init({
    environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID,
    onChange: (oldFlags, params) => { // TSLint: flagsmith's types are any here
        const { isFromServer } = params;

        // Check for changes
        const flagsChanged = Object.keys(oldFlags).some(
            key => flagsmith.getValue(key) !== oldFlags[key]
        );

        if (flagsChanged && !isFromServer) {
            // You might want to reload the page or notify the user
            console.log("Feature flags have changed.");
        }
    }
});

export default flagsmith;
