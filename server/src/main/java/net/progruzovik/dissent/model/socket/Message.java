package net.progruzovik.dissent.model.socket;

public class Message<T> {

    private String subject;
    private T payload;

    public Message(String subject, T payload) {
        this.subject = subject;
        this.payload = payload;
    }

    public Message() { }

    public String getSubject() {
        return subject;
    }

    public T getPayload() {
        return payload;
    }
}
