package nafin.sica.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.chermansolutions.oracle.sso.partnerapp.beans.SSOEnablerJspBean;

@WebServlet(urlPatterns = "/success")
public class Success extends HttpServlet {
    SSOEnablerJspBean sso = new SSOEnablerJspBean();
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("************GETTTTTTTTTTTTT* ejemploSuccess");


       
        try {
            // EJEMPLO DE FLUJO
            // REAL---------------------------------------------------------------
            sso.setPartnerAppCookie(request, response);
            System.out.println("************urlc:sin informacion termino");
            // EJEMPLO DE FLUJO
            // REAL---------------------------------------------------------------
        } catch (Exception e) {
            System.out.println("************cookie errorrrrrrrrrrrr");
            System.out.println("************cookie errorrrrrrrrrrrr:" + e);
        }
      
    }
}
