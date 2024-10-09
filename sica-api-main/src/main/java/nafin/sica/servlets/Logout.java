package nafin.sica.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.chermansolutions.oracle.sso.partnerapp.beans.SSOEnablerJspBean;
@WebServlet(urlPatterns = "/logoff")
public class Logout extends HttpServlet{

     SSOEnablerJspBean sso = new SSOEnablerJspBean();
    private static final long serialVersionUID = 1L;
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            //EJEMPLO DE FLUJO REAL---------------------------------------------------------------
            System.out.println("************FLUJO REAL LOGOUT************************");
            sso.removeJspAppCookies(request,response);
            System.out.println("************removeJspAppCookies************************");
            String logoutURL = sso.getSingleSignOffUrl(request);
            String scheme = request.getScheme();
            String serverName = request.getServerName();
            int portNumber = request.getServerPort();
            String contextPath = request.getContextPath();
            String urlinit= scheme+"://"+serverName+":"+portNumber+contextPath; 
            //response.sendRedirect("https://"+ request.getServerName()+":"+request.getServerPort()+"/sicader-api/init");
            response.sendRedirect(logoutURL+"?p_done_url="+urlinit+"/init");
        } catch(Exception e) {
            e.printStackTrace();
            System.out.println("**error:"+e);
        }
    }
}
