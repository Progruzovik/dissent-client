let data: string[];

export function updateLocalizedData(strings: string[]) {
    data = strings;
}

export function l(s: string): string {
    if (data[s]) return data[s];
    return s;
}
