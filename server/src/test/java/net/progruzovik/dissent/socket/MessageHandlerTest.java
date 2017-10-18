package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.model.player.Player;
import net.progruzovik.dissent.model.player.SessionPlayer;
import net.progruzovik.dissent.model.player.Status;
import net.progruzovik.dissent.model.socket.Message;
import net.progruzovik.dissent.model.socket.WebSocketSessionSender;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public final class MessageHandlerTest {

    private WebSocketSession session;
    private final Map<String, Object> sessionAttributes = new HashMap<>(1);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MessageHandler messageHandler = new MessageHandler(objectMapper);

    public MessageHandlerTest() {
        final Player player = mock(Player.class);
        when(player.getStatus()).thenReturn(Status.IDLE);
        when(player.getWebSocketSessionSender()).thenReturn(new WebSocketSessionSender(objectMapper));
        sessionAttributes.put(SessionPlayer.NAME, player);
    }

    @Before
    public void setUp() {
        session = mock(WebSocketSession.class);
        when(session.getAttributes()).thenReturn(sessionAttributes);
        messageHandler.afterConnectionEstablished(session);
    }

    @Test
    public void handleStatusMessage() throws Exception {
        final Message message = new Message(MessageHandler.STATUS, null);
        messageHandler.handleTextMessage(session, new TextMessage(objectMapper.writeValueAsString(message)));
        verify(session).sendMessage(any(TextMessage.class));
    }
}
