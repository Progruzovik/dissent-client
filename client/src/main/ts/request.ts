import * as m from "mithril";

export function initClient(): Promise<void> {
    return m.request("/api/player/id");
}

export function getStrings(locale: string): Promise<string[]> {
    return m.request<string[]>(`/json/strings.${locale}.json`);
}
