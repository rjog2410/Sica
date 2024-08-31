package nafin.sica.jwt;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nafin.sica.persistence.entity.SesionEntity;
import nafin.sica.persistence.repositories.SesionRepository;
import nafin.sica.service.JwtService;
import nafin.sica.service.SesionService;
import nafin.sica.service.UserDetailServiceImpl;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtils jwtUtils;
    private final UserDetailServiceImpl userDetailServiceImpl;
    // @Autowired
    private final JwtService jwtService;
    private final SesionService sesionService;
    private final SesionRepository sesionRepository;

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String token = getTokenFromRequest(request);

        /*if (token == null || !jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            Integer udpate = sesionService.closeSesion();
            log.info("Se han cerrado - " + Integer.toString(udpate) + " sesiones.");
            return;
        }

        final String id_user = jwtService.getIdFromToken(token);
        Optional<SesionEntity> sesionOptional = sesionRepository.findById(Long.parseLong(id_user));
        SesionEntity sesionEntity = null;
        if (sesionOptional.isPresent()) {
            sesionEntity = sesionOptional.get();
        } else {
            filterChain.doFilter(request, response);
            return;
        }
        String username = sesionEntity.getUsername();

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetail = userDetailServiceImpl.loadUserByUsername(username);
                if (jwtService.isTokenValidFull(token, userDetail)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetail,
                            null, null);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                filterChain.doFilter(request, response);
                return;
            }

        }*/

        filterChain.doFilter(request, response);

    }

    private String getTokenFromRequest(HttpServletRequest request) {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;

    }

}
