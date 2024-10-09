package nafin.sica.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.RolDto;
import nafin.sica.persistence.dto.ResponsesDto.UserCatalogoDto;
import nafin.sica.persistence.dto.ResponsesDto.UserResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteIdDto;
import nafin.sica.persistence.dto.ValidationsDto.RequestUserDto;
import nafin.sica.persistence.dto.ValidationsDto.UserDeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.UserPantallaDto;
import nafin.sica.persistence.entity.PantallasEntity;
import nafin.sica.persistence.entity.RolPantallaEntity;
import nafin.sica.persistence.entity.RolesEntity;
import nafin.sica.persistence.entity.RolesUsersEntity;
import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.entity.UserPantallaEntity;
import nafin.sica.persistence.repositories.PantallaRepository;
import nafin.sica.persistence.repositories.RoleRepository;
import nafin.sica.persistence.repositories.RolesUsersRepository;
import nafin.sica.persistence.repositories.UserPantallaRepository;
import nafin.sica.persistence.repositories.UserRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class UserService {

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    Utils utils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    RolesUsersRepository rolesUsersRepository;

    @Autowired
    UserPantallaRepository userPantallaRepository;

    @Autowired
    PantallaRepository pantallaRepository;


    @Transactional
    public ResponseDto create(RequestUserDto userRequest) {

        // Verificar si el usuario ya existe
        if (userRepository.findUserEntityByUsername(userRequest.getUsername().toUpperCase()).isPresent()) {
            return responseDtoService.buildJsonErrorValidateResponse("El username debe ser único");
        }
        // Crear el usuario
        UserEntity userCreate = UserEntity.builder().nombre(userRequest.getNombre()).telefono(userRequest.getTelefono())
                .transferencia(userRequest.getTransferencia()).ubicacion(userRequest.getUbicacion())
                .username(userRequest.getUsername()).build();

        // Asociar roles
        List<Integer> rolesIds = userRequest.getRolesIds();
        // Crear las relaciones User-Rol y agregarlas a la entidad Rol
        Set<RolesUsersEntity> rolUsuariosSet = new HashSet<>();

        List<RolesEntity> roles = (List<RolesEntity>) roleRepository.findAllById(rolesIds);
        // Validar si todos los ids son válidos
        if (roles.size() != rolesIds.size()) {
            return responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids de rol no son correctos");
        }
        userRepository.save(userCreate);
        for (RolesEntity rol : roles) {
            RolesUsersEntity rolUser = RolesUsersEntity.builder().rolUser(rol).users(userCreate).build();
            rolUsuariosSet.add(rolUser);
        }
        // Guardar las relaciones en la tabla intermedia
        rolesUsersRepository.saveAll(rolUsuariosSet);
        // Agregar las relaciones a la entidad user
        userCreate.getRolUsers().addAll(rolUsuariosSet);
        List<RolDto> rolDto = rolUsuariosSet.stream()
                .map(rol_user -> new RolDto(rol_user.getRolUser().getId(), rol_user.getRolUser().getNombre()))
                .collect(Collectors.toList());
        UserResponseDto rolResponseDto = UserResponseDto.builder().id(userCreate.getId())
                .username(userCreate.getUsername()).roles(rolDto).build();
        return responseDtoService.buildJsonResponseObject(rolResponseDto);
    }

    @Transactional
    public ResponseDto updateUser(RequestUserDto requestUserDto) {

        if (utils.isNullOrZero(requestUserDto.getId())) {
            return responseDtoService.buildJsonErrorValidateResponse("El Id es inválido");
        }
        Optional<UserEntity> userOptional = userRepository.findById(requestUserDto.getId());
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (userRepository.validateUsername(requestUserDto.getId(), requestUserDto.getUsername().toUpperCase())
                    .isPresent()) {
                // validar que el username es unico.
                return responseDtoService.buildJsonErrorValidateResponse("El Username debe ser unico.");
            } else {
                user.setNombre(requestUserDto.getNombre().toUpperCase());
                user.setTelefono(requestUserDto.getTelefono());
                user.setTransferencia(requestUserDto.getTransferencia());
                user.setUbicacion(requestUserDto.getUbicacion());
                user.setUsername(requestUserDto.getUsername());

                List<Integer> rolesIds = requestUserDto.getRolesIds();

                Set<RolesUsersEntity> setRoles = new HashSet<>();

                List<RolesEntity> Roles = (List<RolesEntity>) roleRepository.findAllById(rolesIds);
                if (Roles.size() != rolesIds.size()) {
                    return responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids de roles no son correctos");
                }
                Set<RolesUsersEntity> existingAssociations = user.getRolUsers();
                rolesUsersRepository.deleteAll(existingAssociations);
                existingAssociations.clear();
                userRepository.save(user);
                for (RolesEntity rol : Roles) {
                    RolesUsersEntity rolUser = RolesUsersEntity.builder().rolUser(rol).users(user).build();
                    setRoles.add(rolUser);
                }
                // Guardar las relaciones en la tabla intermedia
                rolesUsersRepository.saveAll(setRoles);

                // Agregar las relaciones a la entidad User
                user.getRolUsers().addAll(setRoles);
                List<RolDto> rolDto = setRoles.stream()
                        .map(rol_user -> new RolDto(rol_user.getRolUser().getId(), rol_user.getRolUser().getNombre()))
                        .collect(Collectors.toList());

                UserResponseDto userResponseDto = UserResponseDto.builder().id(user.getId())
                        .username(user.getUsername()).roles(rolDto).build();
                return responseDtoService.buildJsonResponseObject(userResponseDto);
            }
        } else {
            return responseDtoService.buildJsonErrorValidateResponse("No existe registro con el Id enviado.");
        }

    }

    @Transactional
    public ResponseDto delete(DeleteIdDto userDeleteDto) {

        Optional<UserEntity> userOptional = userRepository.findById(userDeleteDto.getId());
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            // Eliminar asociaciones existentes
            Set<RolesUsersEntity> existingAssociations = user.getRolUsers();
            rolesUsersRepository.deleteAll(existingAssociations);
            existingAssociations.clear();
            Set<UserPantallaEntity> existingAssociationsPantallas = user.getUserPantalla();
            userPantallaRepository.deleteAll(existingAssociationsPantallas);
            existingAssociationsPantallas.clear();
            userRepository.delete(user);
            return responseDtoService.buildJsonResponseString("Usuario eliminado exitosamente.");
        } else {
            return responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el id enviado.");
        }

    }

    @Transactional
    public ResponseDto delete_all(UserDeleteAllDto userDeleteAllDto) {

        List<Integer> UserIds = userDeleteAllDto.getIds();
        List<UserEntity> users = (List<UserEntity>) userRepository.findAllById(UserIds);
        if (users.size() != UserIds.size()) {
            return responseDtoService.buildJsonErrorValidateResponse("Uno o más ids, no son válidos.");
        } else {
            for (UserEntity user : users) {
                Set<RolesUsersEntity> existingAssociations = user.getRolUsers();
                rolesUsersRepository.deleteAll(existingAssociations);
                existingAssociations.clear();
                Set<UserPantallaEntity> existingAssociationsPantallas = user.getUserPantalla();
                userPantallaRepository.deleteAll(existingAssociationsPantallas);
                existingAssociationsPantallas.clear();
                userRepository.delete(user);
            }
            return responseDtoService.buildJsonResponseString("Usuarios eliminados correctamente.");
        }

    }

    @Transactional
    public ResponseDto create_pantallas(UserPantallaDto userPantalla) {
        List<Integer> PantallasIds = userPantalla.getPantallas();
        List<PantallasEntity> pantallas = (List<PantallasEntity>) pantallaRepository.findAllById(PantallasIds);
        if (pantallas.size() != PantallasIds.size()) {
            return responseDtoService.buildJsonErrorValidateResponse("Uno o más ids no son válidos");
        } else {
            Optional<UserEntity> userOptional = userRepository.findById(userPantalla.getId_user());
            if (userOptional.isPresent()) {
                UserEntity user = userOptional.get();
                Set<UserPantallaEntity> ListPantallas = user.getUserPantalla();
                userPantallaRepository.deleteAll(ListPantallas);
                ListPantallas.clear();
                Set<UserPantallaEntity> setUserPantalla = new HashSet<>();
                for (PantallasEntity pantalla : pantallas) {
                    UserPantallaEntity userPantallaEntity = UserPantallaEntity.builder().pantallaUser(pantalla)
                            .userPantalla(user).build();
                    setUserPantalla.add(userPantallaEntity);
                }
                userPantallaRepository.saveAll(setUserPantalla);
                user.getUserPantalla().addAll(setUserPantalla);
                userRepository.save(user);
                return responseDtoService.buildJsonResponseString("Pantallas agregadas exitosamente.");
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el id enviado.");
            }

        }
    }

    public ResponseDto get_permissions(DeleteIdDto userDeleteDto) {
        Optional<UserEntity> userOptional = userRepository.findById(userDeleteDto.getId());
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();

            Set<UserPantallaEntity> userPantallas = user.getUserPantalla();
            Set<Integer> pantallasIds = userPantallas.stream().map(pantalla -> pantalla.getPantallaUser().getId())
                    .collect(Collectors.toSet());
            Set<RolesUsersEntity> rolesUser = user.getRolUsers();
            for (RolesUsersEntity rolUser : rolesUser) {
                RolesEntity rol = rolUser.getRolUser();
                // Obtener pantallas asignadas al rol
                Set<RolPantallaEntity> rolPantallas = rol.getRolPantalla();
                Set<Integer> rolPantallasIds = rolPantallas.stream()
                        .map(rolPantalla -> rolPantalla.getPantallas().getId()).collect(Collectors.toSet());
                // Agregar las pantallas de los roles al conjunto de pantallas
                pantallasIds.addAll(rolPantallasIds);
            }
            // Devolver el conjunto de IDs de pantallas
            List<Integer> pantallasList = new ArrayList<>(pantallasIds);
            Collections.sort(pantallasList);
            return responseDtoService.buildJsonResponseObject(pantallasList);

        } else {
            return responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el id enviado.");
        }
    }

    public ResponseDto get_All_Users() {

        List<UserEntity> users = (List<UserEntity>) userRepository.findAll();
        // Lista que contendrá la respuesta con todos los usuarios
        List<UserCatalogoDto> userResponses = new ArrayList<>();

        for (UserEntity user : users) {
            Set<RolesUsersEntity> rolesUser = user.getRolUsers();
            // Obtener los roles del usuario
            List<RolDto> rolesDto = rolesUser.stream()
                    .map(rolUser -> new RolDto(rolUser.getRolUser().getId(), rolUser.getRolUser().getNombre()))
                    .collect(Collectors.toList());

            // Concatenar los nombres de los roles en un solo String
            String rolesString = rolesUser.stream().map(rolUser -> rolUser.getRolUser().getNombre())
                    .collect(Collectors.joining(", "));
            // creando el DTo
            UserCatalogoDto userResponseDto = UserCatalogoDto.builder().id(user.getId()).username(user.getUsername())
                    .nombre(user.getNombre()).telefono(user.getTelefono()).ubicacion(user.getUbicacion())
                    .transferencia(user.getTransferencia()).roles(rolesDto).rolesString(rolesString).build();

            // Agregar el DTO del usuario a la lista de respuestas
            userResponses.add(userResponseDto);

        }

        return responseDtoService.buildJsonResponseObject(userResponses);
    }

    

}
