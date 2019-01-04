package net.progruzovik.dissent.model.event;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class Event<T> {

    private final @NonNull EventSubject subject;
    private final @Nullable T data;

    public Event(@NonNull EventSubject subject, @Nullable T data) {
        this.subject = subject;
        this.data = data;
    }

    public Event(@NonNull EventSubject subject) {
        this(subject, null);
    }

    @NonNull
    public EventSubject getSubject() {
        return subject;
    }

    @Nullable
    public T getData() {
        return data;
    }
}
