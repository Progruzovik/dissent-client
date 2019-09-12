package net.progruzovik.dissent.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.server.HandlerFunction
import org.springframework.web.reactive.function.server.RequestPredicates.GET
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions.route
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.ServerResponse.ok

@Configuration
class WebConfig {

    @Bean fun indexRouter(): RouterFunction<ServerResponse> {
        return route(
            GET(""),
            HandlerFunction { ok().contentType(MediaType.TEXT_HTML).syncBody(ClassPathResource("static/index.html")) }
        )
    }
}
