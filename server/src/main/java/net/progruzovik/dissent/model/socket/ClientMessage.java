package net.progruzovik.dissent.model.socket;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.Collections;
import java.util.Map;

public final class ClientMessage {

    private final @NonNull ClientSubject subject;
    private final @NonNull Map<String, Integer> data;

    public ClientMessage(@JsonProperty("subject") @NonNull ClientSubject subject,
                         @JsonProperty("data") @Nullable Map<String, Integer> data) {
        this.subject = subject;
        this.data = data == null ? Collections.emptyMap() : data;
    }

    @NonNull
    public ClientSubject getSubject() {
        return subject;
    }

    @NonNull
    public Map<String, Integer> getData() {
        return data;
    }
}
