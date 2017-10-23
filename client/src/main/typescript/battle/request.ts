import axios from "axios";

export function getId(callback: (id: string) => void) {
    axios.get("/api/player/id").then(response => callback(response.data));
}
