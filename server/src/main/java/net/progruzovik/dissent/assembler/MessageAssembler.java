package net.progruzovik.dissent.assembler;

import net.progruzovik.dissent.model.event.Event;
import net.progruzovik.dissent.model.message.ServerMessage;
import net.progruzovik.dissent.model.message.ServerSubject;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public final class MessageAssembler implements Function<Event<?>, ServerMessage<?>> {

    @NonNull
    @Override
    public ServerMessage<?> apply(Event<?> event) {
        return new ServerMessage<>(ServerSubject.valueOf(event.getSubject().name()), event.getData());
    }
}
