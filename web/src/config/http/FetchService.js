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
        if (response.status !== 200) {
            throw new Error("Not 200 response");
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
        if (response.status !== 200) {
            throw new Error("Not 200 response");
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
        if (response.status !== 200) {
            throw new Error("Not 200 response");
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
        if (response.status !== 200) {
            throw new Error("Not 200 response");
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
            throw new Error("Not 200 response");
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
