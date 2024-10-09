package nafin.sica.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import lombok.RequiredArgsConstructor;
import nafin.sica.jwt.JwtAuthenticationFilter;
import nafin.sica.jwt.JwtUtils;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        @Autowired
        JwtUtils jwtUtils;
        @Autowired
        JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {

                return http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(request -> {
                        var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                        corsConfig.setAllowedOrigins(List.of("http://localhost:5173")); // Dominio permitido
                        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Cabeceras permitidas
                        corsConfig.setExposedHeaders(List.of("Authorization")); // Exponer cabeceras como Authorization
                        corsConfig.setAllowCredentials(false); // Permitir credenciales
                        return corsConfig;
                })).authorizeHttpRequests(authRequest -> authRequest.antMatchers("/test/**").permitAll()
                                // .antMatchers("/**/**").permitAll()
                                .antMatchers("/procesos/**").permitAll().antMatchers("/catalogos/**").permitAll()
                                // .antMatchers("/sesion/**").permitAll().antMatchers("/consultas/**").permitAll()
                                .antMatchers("/seguridad/**").permitAll().antMatchers("/consultas/**").permitAll()
                                .antMatchers("/reportes/**").permitAll().antMatchers("/administracion/**").permitAll()
                                .antMatchers("/init").permitAll().antMatchers("/success").permitAll()
                                .antMatchers("/logout").permitAll().antMatchers("/logoff").permitAll().anyRequest()

                                .authenticated())
                                .sessionManagement(sessionManagement -> sessionManagement
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        // Configuración global de CORS para tu API REST
        @Bean
        public WebMvcConfigurer corsConfigurer() {
                return new WebMvcConfigurer() {
                        @SuppressWarnings("null")
                        @Override
                        public void addCorsMappings(CorsRegistry registry) {
                                registry.addMapping("/**") // Permitir CORS en todas las rutas
                                                .allowedOrigins("http://localhost:5173") // Solo permitir este origen
                                                                                         // (React en localhost)
                                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos
                                                                                                           // permitidos
                                                .allowedHeaders("*") // Permitir todos los encabezados
                                                .exposedHeaders("Authorization") // Exponer el header Authorization al
                                                                                 // cliente
                                                .allowCredentials(false); // Permitir el uso de credenciales (si fuera
                                                                         // necesario)
                        }
                };
        }

}
