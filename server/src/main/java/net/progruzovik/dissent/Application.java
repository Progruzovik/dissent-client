package net.progruzovik.dissent;

import net.progruzovik.dissent.config.AppConfig;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public final class Application {

    public static void main(String[] args) throws Exception {
        final ServletContextHandler servletContext = new ServletContextHandler(ServletContextHandler.SESSIONS);
        final AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(AppConfig.class);
        servletContext.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");

        final Server server = new Server(Integer.parseInt(System.getProperty("server.port")));
        server.setHandler(servletContext);
        server.start();
    }
}
