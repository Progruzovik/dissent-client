package net.progruzovik.dissent.model.socket;

public final class ServerMessage<T> extends ClientMessage {

    private T payload;

    public ServerMessage(String subject, T payload) {
        super(subject);
        this.payload = payload;
    }

    public T getPayload() {
        return payload;
    }
}
