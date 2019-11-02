package net.progruzovik.dissent.model.event

import reactor.core.publisher.DirectProcessor
import reactor.core.publisher.Flux
import reactor.core.publisher.FluxSink

open class FluxEmitter<T> : EventEmitter<T> {

    final override val eventStream: Flux<Event<T, *>>
    private val sink: FluxSink<Event<T, *>>

    init {
        val processor = DirectProcessor.create<Event<T, *>>()
        eventStream = processor
        sink = processor.sink()
    }

    inline fun <reified U> on(event: T, crossinline handler: (data: U?) -> Unit) {
        eventStream.subscribe {
            if (it.name == event) {
                handler(it.data as U?)
            }
        }
    }

    inline fun subscribe(crossinline handler: (event: T, data: Any?) -> Unit) {
        eventStream.subscribe { handler(it.name, it.data) }
    }

    final override fun <U> emit(event: T, data: U?) {
        sink.next(Event(event, data))
    }

    final override fun complete() {
        sink.complete()
    }
}
