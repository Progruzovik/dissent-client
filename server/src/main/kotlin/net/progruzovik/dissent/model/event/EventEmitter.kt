package net.progruzovik.dissent.model.event

import reactor.core.publisher.Flux

interface EventEmitter<T> {

    val eventStream: Flux<Event<T, *>>

    fun <U> emit(event: T, data: U? = null)

    fun complete()
}
