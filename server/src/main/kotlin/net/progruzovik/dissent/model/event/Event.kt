package net.progruzovik.dissent.model.event

data class Event<T>(val name: EventName, val data: T? = null)
