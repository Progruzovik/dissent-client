package net.progruzovik.dissent.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.progruzovik.dissent.captain.Player;
import net.progruzovik.dissent.dao.MissionDao;
import net.progruzovik.dissent.dao.TextureDao;
import net.progruzovik.dissent.model.message.ClientMessage;
import net.progruzovik.dissent.model.message.ClientSubject;
import net.progruzovik.dissent.model.message.ServerMessage;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

public final class WebSocketHandlerTest {

    private final ObjectMapper mapper = new ObjectMapper();
    private final WebSocketHandler webSocketHandler;
    private final WebSocketSession session = mock(WebSocketSession.class);
    private final Player player = mock(Player.class);

    public WebSocketHandlerTest() {
        webSocketHandler = new WebSocketHandler(mapper, mock(TextureDao.class), mock(MissionDao.class));
        final Map<String, Object> sessionAttributes = new HashMap<>(1);
        sessionAttributes.put("player", player);
        when(session.getAttributes()).thenReturn(sessionAttributes);
    }

    @Before
    public void setUp() {
        webSocketHandler.afterConnectionEstablished(session);
    }

    @Test
    public void handleStatusMessage() throws Exception {
        final ClientMessage message = new ClientMessage(ClientSubject.REQUEST_STATUS, null);
        webSocketHandler.handleTextMessage(session, new TextMessage(mapper.writeValueAsString(message)));
        verify(player).sendMessage(any(ServerMessage.class));
    }
}
