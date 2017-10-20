package net.progruzovik.dissent.model.socket;

import com.fasterxml.jackson.annotation.JsonIgnore;

public final class Message<T> {

    private Method method;
    private String subject;
    private T payload;

    public Message(String subject, T payload) {
        this.subject = subject;
        this.payload = payload;
    }

    public Message() { }

    @JsonIgnore
    public Method getMethod() {
        return method;
    }

    public String getSubject() {
        return subject;
    }

    public T getPayload() {
        return payload;
    }
}
