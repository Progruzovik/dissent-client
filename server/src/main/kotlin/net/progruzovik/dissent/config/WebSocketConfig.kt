package net.progruzovik.dissent.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter

@Configuration
class WebSocketConfig(private val webSocketHandler: WebSocketHandler) {

    @Bean
    fun handlerMapping() = SimpleUrlHandlerMapping().apply {
        order = 1
        urlMap = mapOf("/app" to webSocketHandler)
    }

    @Bean
    fun handlerAdapter() = WebSocketHandlerAdapter()
}
