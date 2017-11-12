package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.battle.captain.Player;
import net.progruzovik.dissent.battle.captain.SessionPlayer;
import net.progruzovik.dissent.model.socket.Message;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

public final class MessageHandlerTest {

    private WebSocketSession session;
    private final Map<String, Object> sessionAttributes = new HashMap<>(1);

    private final Player player = mock(Player.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MessageHandler messageHandler = new MessageHandler(objectMapper, mock(TextureDao.class));

    public MessageHandlerTest() {
        sessionAttributes.put(SessionPlayer.NAME, player);
    }

    @Before
    public void setUp() {
        session = mock(WebSocketSession.class);
        when(session.getAttributes()).thenReturn(sessionAttributes);
    }

    @Test
    public void handleStatusMessage() throws Exception {
        final Message message = new Message<>("requestStatus", null);
        messageHandler.handleTextMessage(session, new TextMessage(objectMapper.writeValueAsString(message)));
        verify(player).sendMessage(any(Message.class));
    }
}
