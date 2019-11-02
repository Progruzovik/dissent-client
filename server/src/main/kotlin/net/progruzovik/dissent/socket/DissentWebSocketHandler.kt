package net.progruzovik.dissent.socket

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.progruzovik.dissent.captain.SessionPlayer
import net.progruzovik.dissent.model.socket.ClientMessage
import net.progruzovik.dissent.model.socket.ClientSubject
import net.progruzovik.dissent.socket.reader.Reader
import org.springframework.beans.factory.ObjectFactory
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono

@Component
class DissentWebSocketHandler(
    readersList: List<Reader>,
    private val mapper: ObjectMapper,
    private val sessionPlayerFactory: ObjectFactory<SessionPlayer>
) : WebSocketHandler {

    private val readers: Map<ClientSubject, Reader> = readersList.map { it.subject to it }.toMap()

    override fun handle(session: WebSocketSession): Mono<Void> {
        val player = sessionPlayerFactory.getObject().apply {
            id = session.id
        }
        session.attributes["player"] = player

        val input: Mono<Void> = session.receive()
            .map { mapper.readValue<ClientMessage>(it.payloadAsText) }
            .doOnNext { readers.getValue(it.name).read(player, it.data) }
            .then()

        val output: Mono<Void> = player.eventStream
            .map { mapper.writeValueAsString(it) }
            .map { session.textMessage(it) }
            .let { session.send(it) }

        return Mono.zip(input, output).then()
    }
}
