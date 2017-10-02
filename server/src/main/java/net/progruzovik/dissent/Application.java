package net.progruzovik.dissent;

import net.progruzovik.dissent.config.AppConfig;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public final class Application {

    public static void main(String[] args) throws Exception {
        final AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(AppConfig.class);

        final ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        contextHandler.setResourceBase(new ClassPathResource("/static").getURI().toString());
        contextHandler.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");

        final Server server = new Server(8080);
        server.setHandler(contextHandler);
        server.start();
        server.join();
    }
}
