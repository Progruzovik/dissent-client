import * as m from "mithril";

export function getStrings(locale: string): Promise<string[]> {
    return m.request<string[]>(`/json/strings.${locale}.json`);
}
