import {httpClientService} from "config";

const urlBase = "http://localhost:8000/api";

const ApiService = {
    get(url) {
        return httpClientService.get(urlBase + url);
    },

    post(url, data) {
        return httpClientService.post(urlBase + url, data);
    },

    put(url, data) {
        return httpClientService.put(urlBase + url, data);
    },
};

export default ApiService;
