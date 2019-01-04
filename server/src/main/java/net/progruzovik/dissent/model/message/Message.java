package net.progruzovik.dissent.model.message;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class Message<T> {

    private final @NonNull String subject;
    private final @Nullable T data;

    public Message(@NonNull String subject, @Nullable T data) {
        this.subject = subject;
        this.data = data;
    }

    public Message(@NonNull String subject) {
        this(subject, null);
    }

    @NonNull
    public String getSubject() {
        return subject;
    }

    @Nullable
    public T getData() {
        return data;
    }
}
