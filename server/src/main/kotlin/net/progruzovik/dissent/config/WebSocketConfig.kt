package net.progruzovik.dissent.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter

@Configuration
class WebSocketConfig(private val webSocketHandler: WebSocketHandler) {

    @Bean
    fun webSocketHandlerMapping(): HandlerMapping {
        val handlerMapping = SimpleUrlHandlerMapping()
        handlerMapping.order = 1
        handlerMapping.urlMap = mapOf(
            "/app" to webSocketHandler
        )
        return handlerMapping
    }

    @Bean
    fun handlerAdapter() = WebSocketHandlerAdapter()
}
