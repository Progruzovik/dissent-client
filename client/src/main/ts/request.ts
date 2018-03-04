import * as m from "mithril";

export function initClient(locale: string, callback: (strings: string[]) => void) {
    m.request("/api/player/id").then(() => {
        m.request(`/json/strings.${locale}.json`).then((strings: string[]) => {
            callback(strings);
        });
    });
}
