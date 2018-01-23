package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.captain.Player;
import net.progruzovik.dissent.captain.SessionPlayer;
import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.model.Message;
import net.progruzovik.dissent.service.MissionDigest;
import net.progruzovik.dissent.socket.model.MessageSender;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

public final class MessageHandlerTest {

    private final ObjectMapper mapper = new ObjectMapper();
    private final MessageHandler messageHandler;
    private final WebSocketSession session = mock(WebSocketSession.class);

    public MessageHandlerTest() {
        messageHandler = new MessageHandler(mapper, mock(MissionDigest.class), mock(TextureDao.class));
        final Map<String, Object> sessionAttributes = new HashMap<>(1);
        final Player player = mock(Player.class);
        when(player.getMessageSender()).thenReturn(new MessageSender(mapper));
        sessionAttributes.put(SessionPlayer.NAME, player);
        when(session.getAttributes()).thenReturn(sessionAttributes);
    }

    @Before
    public void setUp() {
        messageHandler.afterConnectionEstablished(session);
    }

    @Test
    public void handleStatusMessage() throws Exception {
        final Message message = new Message<>("requestStatus", null);
        messageHandler.handleTextMessage(session, new TextMessage(mapper.writeValueAsString(message)));
        verify(session).sendMessage(any(WebSocketMessage.class));
    }
}
