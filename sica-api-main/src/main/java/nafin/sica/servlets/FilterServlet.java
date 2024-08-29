package nafin.sica.servlets;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

@WebFilter(urlPatterns = "/*")
public class FilterServlet implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String url = request instanceof HttpServletRequest ? ((HttpServletRequest) request).getRequestURL().toString()
                : "N/A";
        System.out.println("from filter, processing url: " + url);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }

}
