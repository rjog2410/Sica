package nafin.sica.servlets;

import com.chermansolutions.oracle.sso.partnerapp.beans.SSOEnablerJspBean;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

//@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
@WebServlet(urlPatterns = "/init")
public class Login extends HttpServlet {

    /**
     *
     */
    com.chermansolutions.oracle.sso.partnerapp.beans.SSOEnablerJspBean sso = new SSOEnablerJspBean();
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("************GETTTTTTTTTTTTT*");
        System.out.println("************request.getProtocol():" + request.getProtocol());
        System.out
                .println("https://" + request.getServerName() + ":" + request.getServerPort() + "/sicader-api/success");
        System.out.println("******************************************************************");
        System.out.println("request.getContextPath():" + request.getContextPath());
        System.out.println("request.getServerName():" + request.getServerName());
        System.out.println("request.getRemoteHost():" + request.getRemoteHost());
        System.out.println("request.getPathInfo():" + request.getPathInfo());
        System.out.println("request.getServletPath():" + request.getServletPath());
        System.out.println(request.getPathInfo());
        System.out.println(request.getServletPath());
        System.out.println(request.getContextPath() + request.getServerPort());
        System.out.println("******************************************************************");
        HttpSession session = request.getSession();

        String ssoUserInfo = null;
        String user = null;
        try {
            // configuración para local
            // ssoUserInfo = "JCARIAS";
            // Configuración producción
            ssoUserInfo = sso.getSSOUserInfo(request, response);

            if (ssoUserInfo != null) {
                if (ssoUserInfo.indexOf("/") != -1) {
                    user = ssoUserInfo.substring(0, ssoUserInfo.indexOf("/"));
                    System.out.println("usuario::  " + user);
                }
                session.setAttribute("username", user);
                System.out.println("************urlc:con informacion");
                String token = "token";
                String convertT = "Token Encriptado";
                System.out.println("************urlc:token:" + token);
                System.out.println("************urlc:token:" + convertT);
                // Configuración para producción
                //String urlEnvio = "https://" + request.getServerName() + ":" + request.getServerPort()
                       // + "/sicader/login?xzc=" + convertT + "&user=" + user;
                // Configuración para local
                String urlEnvio="http://localhost:3000/sicader/login?xzc="+convertT;
                response.sendRedirect(urlEnvio);
            }
            System.out.println("Termino login===");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }



}