package net.progruzovik.dissent.config.socket;

import net.progruzovik.dissent.captain.Player;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public final class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final ObjectFactory<Player> playerFactory;

    public WebSocketHandshakeInterceptor(ObjectFactory<Player> playerFactory) {
        this.playerFactory = playerFactory;
    }

    @Override
    public boolean beforeHandshake(@NonNull ServerHttpRequest request,
                                   @NonNull ServerHttpResponse response,
                                   @NonNull WebSocketHandler webSocketHandler,
                                   @NonNull Map<String, Object> attributes) {
        attributes.put("player", playerFactory.getObject());
        return true;
    }

    @Override
    public void afterHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response,
                               @NonNull WebSocketHandler webSocketHandler, @Nullable Exception ex) { }
}
