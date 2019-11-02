package net.progruzovik.dissent.model.event

data class Event<T, U>(val name: T, val data: U? = null)
