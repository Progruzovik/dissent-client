package net.progruzovik.dissent.socket

import net.progruzovik.dissent.model.event.FluxEmitter
import net.progruzovik.dissent.model.socket.ServerSubject
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class DissentWebSocketOutput : FluxEmitter<ServerSubject>()
