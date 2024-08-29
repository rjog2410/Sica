package nafin.sica.jwt;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {

    private static final Key secret_key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // @Value("${jwt.time.expiration}")
    private String TimeExpiration = "1800000";
    // private String TimeExpiration = "15000";

    public String GetToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(TimeExpiration)))
                .signWith(secret_key)
                .compact();

    }

    // Validar Token de Acceso
    public boolean isTokenValid(String Token) {

        try {
            Jwts.parserBuilder()
                    .setSigningKey(secret_key)
                    .build()
                    .parseClaimsJws(Token)
                    .getBody();

            return true;
        } catch (Exception e) {
            log.error("Token Inválido , error: ".concat(e.getMessage()));
            return false;
        }
    }

    public boolean isTokenValidFull(String Token, UserDetails userDetails) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secret_key)
                    .build()
                    .parseClaimsJws(Token)
                    .getBody();

            final String username = getUsernameFromToken(Token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(Token));
        } catch (Exception e) {
            log.error("Token Inválido , error: ".concat(e.getMessage()));
            return false;
        }

    }

    // Obtener Claims
    public Claims getAllClaims(String Token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret_key)
                .build()
                .parseClaimsJws(Token)
                .getBody();
    }

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
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

}
