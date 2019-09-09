package net.progruzovik.dissent.model.event

import reactor.core.publisher.DirectProcessor

open class EventEmitter {

    val eventStream: DirectProcessor<Event<*>> = DirectProcessor.create<Event<*>>()

    inline fun <reified T> on(event: EventName, crossinline handler: (data: T?) -> Unit) {
        eventStream.subscribe {
            if (it.name == event) {
                handler(it.data as T?)
            }
        }
    }

    inline fun on(crossinline handler: (event: EventName, data: Any?) -> Unit) {
        eventStream.subscribe { handler(it.name, it.data) }
    }

    fun <T> emit(event: EventName, data: T?) = eventStream.onNext(Event(event, data))

    fun emit(event: EventName) = emit(event, null)

    fun complete() = eventStream.onComplete()
}
