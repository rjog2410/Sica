package nafin.sica.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.entity.RolPantallaEntity;
import nafin.sica.persistence.entity.RolesEntity;
import nafin.sica.persistence.entity.RolesUsersEntity;
import nafin.sica.persistence.entity.SesionEntity;
import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.entity.UserPantallaEntity;
import nafin.sica.persistence.repositories.SesionRepository;
import nafin.sica.persistence.repositories.UserRepository;

@Service
@AllArgsConstructor
public class SesionService {
    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    JwtService jwtService;

    @Autowired
    ResponseDtoService responseDtoService;



    @Transactional
    public Integer closeSesion() {
        try {
            // SesionEntity closeSesion = sesionRepository.closeSesion();
            LocalDateTime date_logout = LocalDateTime.now();
            LocalDateTime date_login = LocalDateTime.now().minusMinutes(30);
            System.out.println("login - " + date_login);
            System.out.println("logout - " + date_logout);
            Integer update = sesionRepository.closeSesion(date_logout, date_login);
            return update;
        } catch (Exception e) {
            return 0;
        }

    }

    @Transactional
    public String createTokenSesion(String username) {
        try {
            Optional<UserEntity> userOptional = userRepository.findByUsername(username.toUpperCase());
            String token = "";
            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();
                SesionEntity sesionEntity = SesionEntity.builder().date_login(LocalDateTime.now()).user(user).build();
                user.getSesiones().add(sesionEntity);
                sesionRepository.save(sesionEntity);
                token = jwtService.getToken(sesionEntity.getId());
            }
            return token;
        } catch (Exception e) {
            // e.printStackTrace();
            System.out.println(e.getMessage());
            return "";
        }

    }

    public ResponseDto get_user_info(String header) {
        String token = header.replace("Bearer ", "");
        String id = jwtService.getIdFromToken(token);
        HashMap<String, Object> response = new HashMap<>();
        Optional<SesionEntity> sesionOptional = sesionRepository.findById(Long.parseLong(id));
        if (sesionOptional.isPresent()) {
            SesionEntity sesion = sesionOptional.get();
            Optional<UserEntity> userOptional = userRepository.findById(sesion.getUser().getId());
            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();

                Set<UserPantallaEntity> userPantallas = user.getUserPantalla();
                Set<String> pantallasPermisos = userPantallas.stream().map(pantalla -> pantalla.getPantallaUser().getUrl())
                        .collect(Collectors.toSet());
                Set<RolesUsersEntity> rolesUser = user.getRolUsers();
                Set<String> rolesName = new HashSet<>();
                for (RolesUsersEntity rolUser : rolesUser) {
                    rolesName.add(rolUser.getRolUser().getNombre());
                    RolesEntity rol = rolUser.getRolUser();
                    // Obtener pantallas asignadas al rol
                    Set<RolPantallaEntity> rolPantallas = rol.getRolPantalla();
                    Set<String> rolPantallasIds = rolPantallas.stream()
                            .map(rolPantalla -> rolPantalla.getPantallas().getUrl()).collect(Collectors.toSet());
                    // Agregar las pantallas de los roles al conjunto de pantallas
                    pantallasPermisos.addAll(rolPantallasIds);
                }
                // Devolver el conjunto de IDs de pantallas
                List<String> pantallasList = new ArrayList<>(pantallasPermisos);
                Collections.sort(pantallasList);
                response.put("id", user.getId());
                response.put("name", user.getNombre());
                response.put("username", user.getUsername());
                response.put("roles", rolesName);
                response.put("permissions", pantallasList);
                return responseDtoService.buildJsonResponseObject(response);

            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el id de la sesion.");
            }

        } else {
            return responseDtoService.buildJsonErrorValidateResponse("No existe usuario con la sesion enviada.");
        }

    }

}
