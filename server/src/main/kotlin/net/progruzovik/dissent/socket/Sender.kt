package net.progruzovik.dissent.socket

import net.progruzovik.dissent.model.socket.ServerSubject
import org.springframework.web.reactive.socket.WebSocketSession

interface Sender {

    fun setUpSession(session: WebSocketSession)

    fun <T> sendMessage(subject: ServerSubject, data: T?)

    fun sendMessage(subject: ServerSubject) = sendMessage(subject, null)
}
