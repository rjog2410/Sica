package nafin.sica.service;

import java.security.Key;
import java.util.Date;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nafin.sica.persistence.entity.SesionEntity;
import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.repositories.SesionRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    private static final Key Secret_Key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // @Value("${jwt.time.expiration}")
    private String TimeExpiration = "1800000";
    @Autowired
    private final SesionRepository sesionRepository;

    public String getToken(Long Id) {
        return Jwts.builder().setId(Long.toString(Id)).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(TimeExpiration)))
                .signWith(Secret_Key).compact();
    }

    // Validar Token de Acceso
    public boolean isTokenValid(String Token) {

        try {
            Jwts.parserBuilder().setSigningKey(Secret_Key).build().parseClaimsJws(Token).getBody();

            return true;
        } catch (Exception e) {
            log.error("Token Inválido , error: ".concat(e.getMessage()));
            return false;
        }
    }

    @Transactional(readOnly = true)
    public boolean isTokenValidFull(String Token, UserDetails userDetails) {
        try {
            Jwts.parserBuilder().setSigningKey(Secret_Key).build().parseClaimsJws(Token).getBody();
            SesionEntity sesionEntity = null;
            final String id_user = getIdFromToken(Token);
            Optional<SesionEntity> userSesion = sesionRepository.findById(Long.parseLong(id_user));
            if (userSesion.isPresent()) {
                sesionEntity = userSesion.get();
            } else {
                return false;
            }
            UserEntity user = sesionEntity.getUser();
            String username = user.getUsername();
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(Token));
        } catch (Exception e) {
            log.error("Token Inválido , error: ".concat(e.getMessage()));
            return false;
        }
    }

    // Obtener Claims
    public Claims getAllClaims(String Token) {
        return Jwts.parserBuilder().setSigningKey(Secret_Key).build().parseClaimsJws(Token).getBody();
    }

    public String getIdFromToken(String token) {
        return getClaim(token, Claims::getId);
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsFunction) {
        Claims claims = getAllClaims(token);
        return claimsFunction.apply(claims);

    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }

    @SuppressWarnings("unused")
    public String getIdSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();

        String id = getIdFromToken(token);

        return id;

    }

}
