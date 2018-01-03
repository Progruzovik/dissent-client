import axios from "axios";

export function initClient(locale: string, callback: (strings: string[], id: number) => void) {
    axios.all([
        axios.get(`/json/strings.${locale}.json`),
        axios.get("/api/player/id")
    ]).then(axios.spread(((strings, id) => callback(strings.data, id.data))));
}
