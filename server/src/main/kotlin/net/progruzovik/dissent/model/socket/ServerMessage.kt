package net.progruzovik.dissent.model.socket

data class ServerMessage<T>(val subject: ServerSubject, val data: T?)
