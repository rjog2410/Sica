package nafin.sica.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

                return http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable())
                                .authorizeHttpRequests(authRequest -> authRequest.antMatchers("/test/**").permitAll()
                                                // .antMatchers("/**/**").permitAll()
                                                .antMatchers("/procesos/**").permitAll().antMatchers("/catalogos/**")
                                                .permitAll().antMatchers("/seguridad/**").permitAll()
                                                .antMatchers("/consultas/**").permitAll().antMatchers("/reportes/**")
                                                .permitAll().antMatchers("/administracion/**").permitAll().anyRequest()
                                                .authenticated())
                                .sessionManagement(sessionManagement -> sessionManagement
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

}
