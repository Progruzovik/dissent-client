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
        final ServletContextHandler servletContext = new ServletContextHandler(ServletContextHandler.SESSIONS);
        servletContext.setResourceBase(new ClassPathResource("/static").getURI().toString());

        final AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(AppConfig.class);
        servletContext.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");

        final Server server = new Server(8080);
        server.setHandler(servletContext);
        server.start();
    }
}
