package net.progruzovik.dissent.model.socket;

public final class Message {

    private String title;
    private String payload;

    public Message(String title, String data) {
        this.title = title;
        this.payload = data;
    }

    public Message() { }

    public String getTitle() {
        return title;
    }

    public String getPayload() {
        return payload;
    }
}
