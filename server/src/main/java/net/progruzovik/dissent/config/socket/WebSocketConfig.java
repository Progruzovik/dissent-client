package net.progruzovik.dissent.config.socket;

import net.progruzovik.dissent.socket.WebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    private final WebSocketHandshakeInterceptor handshakeInterceptor;

    public WebSocketConfig(WebSocketHandler webSocketHandler, WebSocketHandshakeInterceptor handshakeInterceptor) {
        this.webSocketHandler = webSocketHandler;
        this.handshakeInterceptor = handshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/app/")
                .addInterceptors(handshakeInterceptor)
                .setAllowedOrigins("*");
    }
}
