package net.progruzovik.dissent.socket.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.progruzovik.dissent.model.Message;

import java.util.Map;

public final class IncomingMessage extends Message<Map<String, Integer>> {

    public IncomingMessage(@JsonProperty("subject") String subject,
                           @JsonProperty("data") Map<String, Integer> data) {
        super(subject, data);
    }
}
