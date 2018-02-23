package net.progruzovik.dissent.model;

public class Message<T> {

    private final String subject;
    private final T data;

    public Message(String subject, T data) {
        this.subject = subject;
        this.data = data;
    }

    public Message(String subject) {
        this(subject, null);
    }

    public String getSubject() {
        return subject;
    }

    public T getData() {
        return data;
    }
}
