package net.progruzovik.dissent.model.socket

import java.util.*

class ClientMessage(val subject: ClientSubject, data: Map<String, Int>?) {

    val data: Map<String, Int> = data ?: Collections.emptyMap()
}
