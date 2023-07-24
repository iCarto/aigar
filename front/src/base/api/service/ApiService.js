import {httpClientService} from "../utilities";

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

    patch(url, data, bulk = false) {
        return httpClientService.patch(
            urlBase + url,
            data,
            bulk ? {"X-BULK-OPERATION": true} : {}
        );
    },

    delete(url) {
        return httpClientService.delete(urlBase + url);
    },
};

export default ApiService;
