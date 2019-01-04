package net.progruzovik.dissent.model.message;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public final class ServerMessage<T> {

    private final @NonNull
    ServerSubject subject;
    private final @Nullable T data;

    public ServerMessage(@NonNull ServerSubject subject, @Nullable T data) {
        this.subject = subject;
        this.data = data;
    }

    public ServerMessage(@NonNull ServerSubject subject) {
        this(subject, null);
    }

    @NonNull
    public ServerSubject getSubject() {
        return subject;
    }

    @Nullable
    public T getData() {
        return data;
    }
}
