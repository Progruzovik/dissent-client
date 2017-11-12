package net.progruzovik.dissent.model.socket;

public class Message<T> {

    private String subject;
    private T data;

    public Message(String subject, T data) {
        this.subject = subject;
        this.data = data;
    }

    public Message(String subject) {
        this.subject = subject;
    }

    public Message() { }

    public String getSubject() {
        return subject;
    }

    public T getData() {
        return data;
    }
}
