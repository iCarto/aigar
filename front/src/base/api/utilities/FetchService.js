const urlBase = "http://localhost:8000/api";

/**
 * @param {string}  url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser asi, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante urlBase
 **/
const readUrl = (url = "") =>
    url.startsWith("http://") || url.startsWith("https://") ? url : `${urlBase}/${url}`;

const get = (url = "", headers = {}) =>
    fetch(readUrl(url), {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    }).then(response => {
        if (response.status !== 200 && response.status !== 201) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    });

const post = (url = "", body = {}, headers = {}) =>
    fetch(readUrl(url), {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    }).then(response => {
        console.log(response);
        if (response.status !== 200 && response.status !== 201) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    });

const put = (url = "", body = {}, headers = {}) =>
    fetch(readUrl(url), {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    }).then(response => {
        if (response.status === 204) {
            return;
        } else if (response.status !== 200) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    });

const patch = (url = "", body = {}, headers = {}) =>
    fetch(readUrl(url), {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    }).then(response => {
        if (response.status !== 200 && response.status !== 204) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        if (parseInt(response.headers.get("content-length")) === 0) {
            return true;
        }
        return response.json();
    });

const del = (url = "", headers = {}) =>
    fetch(readUrl(url), {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    }).then(response => {
        if (response.status !== 200) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();
    });

export default {
    get,
    post,
    put,
    patch,
    delete: del,
};
