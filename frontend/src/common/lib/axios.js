import VueAxios from "vue-axios";
import axios from "axios";
import store from "@/store/index.js";

// import config from '../config'

const DEFAULT_ACCEPT_TYPE = "application/json";
let local = store.getters["accountStore/getToken"];

axios.defaults.headers["Content-Type"] = DEFAULT_ACCEPT_TYPE;
if (local) {
  axios.defaults.headers["Authorization"] = `Bearer ${local}`;
}

export default { VueAxios, axios };

