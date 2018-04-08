package net.progruzovik.dissent.socket.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.progruzovik.dissent.model.Message;
import org.springframework.lang.NonNull;

import java.util.Map;

public final class IncomingMessage extends Message<Map<String, Integer>> {

    public IncomingMessage(@JsonProperty("subject") @NonNull String subject,
                           @JsonProperty("data") @NonNull Map<String, Integer> data) {
        super(subject, data);
    }
}
