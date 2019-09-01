package net.progruzovik.dissent.socket

import com.fasterxml.jackson.databind.ObjectMapper
import net.progruzovik.dissent.getLogger
import net.progruzovik.dissent.model.message.Sender
import net.progruzovik.dissent.model.message.ServerMessage
import org.springframework.beans.factory.config.ConfigurableBeanFactory
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono
import java.io.IOException

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
class DissentWebSocketSender(private val mapper: ObjectMapper) : Sender {

    private var session: WebSocketSession? = null

    override fun setSession(session: WebSocketSession?) {
        this.session = session
    }

    override fun <T> sendMessage(message: ServerMessage<T>) {
        val currentSession: WebSocketSession = session ?: return
        try {
            val webSocketMessage: WebSocketMessage = currentSession.textMessage(mapper.writeValueAsString(message))
            currentSession.send(Mono.just(webSocketMessage)).subscribe()
        } catch (e: IOException) {
            log.error("Can't send message with subject \"{}\"!", message.subject, e)
            session = null
        }
    }

    companion object {
        private val log = getLogger<DissentWebSocketSender>()
    }
}
