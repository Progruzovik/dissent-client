package net.progruzovik.dissent.model.socket;

public class ClientMessage {

    private String subject;

    public ClientMessage(String subject) {
        this.subject = subject;
    }

    public ClientMessage() { }

    public String getSubject() {
        return subject;
    }
}
