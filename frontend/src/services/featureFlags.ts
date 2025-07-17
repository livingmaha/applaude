import flagsmith from 'flagsmith';

const FLAGSMITH_ENV_KEY = import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY;

flagsmith.init({
    environmentID: FLAGSMITH_ENV_KEY,
    onChange: (oldFlags, params) => {
        // You can handle flag changes here
    }
});

export default flagsmith;
