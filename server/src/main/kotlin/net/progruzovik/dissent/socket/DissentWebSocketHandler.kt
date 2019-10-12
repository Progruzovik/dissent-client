package net.progruzovik.dissent.socket

import com.fasterxml.jackson.databind.ObjectMapper
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
        val player = sessionPlayerFactory.getObject()
        session.attributes["player"] = player
        player.setUpSession(session)
        return session.receive()
            .map { it.payloadAsText }
            .doOnNext {
                val message: ClientMessage = mapper.readValue(it, ClientMessage::class.java)
                readers.getValue(message.subject).read(player, message.data)
            }
            .then()
    }
}
