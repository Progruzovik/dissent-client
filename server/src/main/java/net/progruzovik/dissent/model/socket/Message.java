package net.progruzovik.dissent.model.socket;

public final class Message {

    private String title;
    private Object payload;

    public Message(String title, Object payload) {
        this.title = title;
        this.payload = payload;
    }

    public Message() { }

    public String getTitle() {
        return title;
    }

    public Object getPayload() {
        return payload;
    }
}
