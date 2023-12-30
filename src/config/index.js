import { prodConfigs } from './prod.config.js';
import { localConfigs } from './local.config.js';


let configs = {};

if (process.env.REACT_APP_BUILDTYPE === "TESTING") {
    configs = localConfigs
}
else {
    configs = prodConfigs
}

export default configs
