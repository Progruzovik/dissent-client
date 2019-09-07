package net.progruzovik.dissent.socket

import net.progruzovik.dissent.model.socket.ServerMessage
import org.springframework.web.reactive.socket.WebSocketSession

interface Sender {

    fun setUpSession(session: WebSocketSession)

    fun <T> sendMessage(message: ServerMessage<T>)
}
