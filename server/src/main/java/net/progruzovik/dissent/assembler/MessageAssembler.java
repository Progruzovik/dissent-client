package net.progruzovik.dissent.assembler;

import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.message.Message;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public final class MessageAssembler implements Function<Event<?>, Message<?>> {

    @NonNull
    @Override
    public Message<?> apply(Event<?> event) {
        return new Message<>(event.getSubject().name(), event.getData());
    }
}
