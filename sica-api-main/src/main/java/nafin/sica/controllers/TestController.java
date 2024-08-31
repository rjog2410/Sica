package nafin.sica.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import nafin.sica.jwt.JwtUtils;
import nafin.sica.persistence.entity.SesionEntity;
import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.repositories.SesionRepository;
import nafin.sica.persistence.repositories.UserRepository;
import nafin.sica.service.JwtService;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

@RestController
@RequiredArgsConstructor
public class TestController {
    // @Value("${jwt.time.expiration}")
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SesionRepository sesionRepository;
    @Autowired
    private JwtUtils jwtUtils;

    private final JwtService jwtService;

    @GetMapping("/test/index")
    public String index() {
        String username = "EOLMOSPE";
        UserEntity sicaUser = null;
        // Optional<SicaUser> userOptional = userRepository.getClaveUser(username);
        Optional<UserEntity> userOptional2 = userRepository.findUserEntityByUsername(username);
        // if(userOptional.isPresent()){
        // sicaUser = userOptional.get();
        // }else{
        // return "no se encuentra el usuario";
        // }
        if (userOptional2.isPresent()) {
            sicaUser = userOptional2.get();
        } else {
            return "no se encuentra el usuario";
        }

        System.out.println(sicaUser);

        return sicaUser.getUsername();
    }

    @GetMapping("/test/create_test")
    public String index_two() {
        String username = "JCARIAS";
        // String token = create_user(username);
        // return token;

        try {
            // SicaUser sicaUser = SicaUser.builder()
            // .usu_clave(username)
            // .usu_nombre("Maik")
            // .usu_telefono("5529409094")
            // .usu_transferencia("S")
            // .usu_ubicacion(null)
            // .id_rol(1)
            // .build();
            // userRepository.save(sicaUser);
            String token = jwtUtils.GetToken(username);
            return token;
        } catch (Exception e) {
            return "Ocurrio un error:";
        }

    }

    @GetMapping("/test/create_test2")
    public String index_three() {
        String username = "JCARIAS";
        // String token = create_user(username);
        // return token;
        String token = "";
        try {
            // SicaUser sicaUser = SicaUser.builder()
            // .usu_clave(username)
            // .usu_nombre("Maik")
            // .usu_telefono("5529409094")
            // .usu_transferencia("S")
            // .usu_ubicacion(null)
            // .id_rol(1)
            // .build();
            // userRepository.save(sicaUser);
            SesionEntity sesionEntity = SesionEntity.builder().username(username).build();
            sesionRepository.save(sesionEntity);
            System.out.println(sesionEntity.getId());
            token = jwtService.getToken(sesionEntity.getId());
        } catch (Exception e) {
            return "Ocurrio un error:";
        }

        return token;

    }

    public String create_user(String username) {
        try {
            // SicaUser sicaUser = SicaUser.builder()
            // .usu_clave(username)
            // .usu_telefono("5529409094")
            // .usu_transferencia("S")
            // .usu_ubicacion(null)
            // .id_rol(1)
            // .build();
            // userRepository.save(sicaUser);
            // String token = jwtUtils.GetToken(username);
            

            return username;
        } catch (Exception e) {
            // TODO: handle exception
            return e.getMessage();
        }

    }

    @GetMapping("index/secure")
    public String index_secure() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(auth.getName());
        return auth.getName();
    }

    public Map<String, Object> get_pdf() {
        Map<String, Object> response = new HashMap<>();
        
        return response;
    }

}
