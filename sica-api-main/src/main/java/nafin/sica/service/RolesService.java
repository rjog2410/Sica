package nafin.sica.service;

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
import nafin.sica.persistence.dto.PantallaDto;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.RolDto;
import nafin.sica.persistence.dto.ResponsesDto.RolResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.RolDeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.RolDeleteDto;
import nafin.sica.persistence.dto.ValidationsDto.RolRequestDto;
import nafin.sica.persistence.dto.ValidationsDto.RolUpdateDto;
import nafin.sica.persistence.entity.PantallasEntity;
import nafin.sica.persistence.entity.RolPantallaEntity;
import nafin.sica.persistence.entity.RolesEntity;
import nafin.sica.persistence.repositories.PantallaRepository;
import nafin.sica.persistence.repositories.RolPantallaRepository;
import nafin.sica.persistence.repositories.RoleRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class RolesService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PantallaRepository pantallaRepository;

    @Autowired
    private RolPantallaRepository rolPantallaRepository;

    @Autowired
    private ResponseDtoService responseDtoService;

    @Transactional
    public ResponseDto createRol(RolRequestDto rolRequestDTO) {
        try {
            // Verificar si el rol ya existe
            if (roleRepository.findByNombre(rolRequestDTO.getNombre().toUpperCase()).isPresent()) {
                return responseDtoService.buildJsonErrorValidateResponse("El nombre debe ser único");
            }
            // Crear el rol
            RolesEntity rolesEntity = RolesEntity.builder().nombre(rolRequestDTO.getNombre().toUpperCase()).build();

            // Asociar pantallas
            List<Integer> pantallaIds = rolRequestDTO.getPantallasIds();
            // Crear las relaciones Rol-Pantalla y agregarlas a la entidad Rol
            Set<RolPantallaEntity> rolPantallaSet = new HashSet<>();
            if (pantallaIds != null && !pantallaIds.isEmpty()) {
                List<PantallasEntity> pantallas = (List<PantallasEntity>) pantallaRepository.findAllById(pantallaIds);
                // Validar si todos los ids son válidos
                if (pantallas.size() != pantallaIds.size()) {
                    return responseDtoService
                            .buildJsonErrorValidateResponse("Uno o más Ids de pantallas no son correctos");
                }
                roleRepository.save(rolesEntity);
                for (PantallasEntity pantalla : pantallas) {
                    RolPantallaEntity rolPantalla = RolPantallaEntity.builder().roles(rolesEntity).pantallas(pantalla)
                            .build();
                    rolPantallaSet.add(rolPantalla);
                }
                // Guardar las relaciones en la tabla intermedia
                rolPantallaRepository.saveAll(rolPantallaSet);

                // Agregar las relaciones a la entidad Rol
                rolesEntity.getRolPantalla().addAll(rolPantallaSet);
            }

            List<PantallaDto> pantallaDtos = rolPantallaSet.stream()
                    .map(rolPantalla -> new PantallaDto(rolPantalla.getPantallas().getId(),
                            rolPantalla.getPantallas().getNombre(), rolPantalla.getPantallas().getUrl()))
                    .collect(Collectors.toList());

            RolResponseDto rolResponseDto = RolResponseDto.builder().id(rolesEntity.getId())
                    .nombre(rolesEntity.getNombre()).Pantallas(pantallaDtos).build();

            return responseDtoService.buildJsonResponseObject(rolResponseDto);

        } catch (Exception e) {
            return responseDtoService.buildJsonResponseString(e.getMessage());
        }

    }

    @Transactional
    public ResponseDto updateRol(RolUpdateDto rolUpdateDto) {
        try {
            // Verificar si el rol ya existe
            Optional<RolesEntity> rol = roleRepository.findById(rolUpdateDto.getId());
            if (rol.isPresent()) {
                RolesEntity role = rol.get();
                if (roleRepository.findByNombreValidate(rolUpdateDto.getNombre().toUpperCase(), rolUpdateDto.getId())
                        .isPresent()) {
                    return responseDtoService.buildJsonErrorValidateResponse("El nombre debe ser único");
                } else {
                    // Logica cuando el rol existe y el nombre es unico.

                    // Actualizar el nombre del rol
                    role.setNombre(rolUpdateDto.getNombre().toUpperCase());
                   

                    // Actualizar las pantallas asociadas
                    Set<RolPantallaEntity> existingAssociations = role.getRolPantalla();
                    // Eliminar asociaciones existentes
                    rolPantallaRepository.deleteAll(existingAssociations);
                    existingAssociations.clear();

                    // Agregar los nuevos roles.

                    // Asociar pantallas
                    List<Integer> pantallaIds = rolUpdateDto.getPantallasIds();
                    // Crear las relaciones Rol-Pantalla y agregarlas a la entidad Rol
                    Set<RolPantallaEntity> rolPantallaSet = new HashSet<>();
                    if (pantallaIds != null && !pantallaIds.isEmpty()) {
                        List<PantallasEntity> pantallas = (List<PantallasEntity>) pantallaRepository
                                .findAllById(pantallaIds);
                        // Validar si todos los ids son válidos
                        if (pantallas.size() != pantallaIds.size()) {
                            return responseDtoService
                                    .buildJsonErrorValidateResponse("Uno o más Ids de pantallas no son correctos");
                        }
                        roleRepository.save(role);
                        for (PantallasEntity pantalla : pantallas) {
                            RolPantallaEntity rolPantalla = RolPantallaEntity.builder().roles(role).pantallas(pantalla)
                                    .build();
                            rolPantallaSet.add(rolPantalla);
                        }
                        // Guardar las relaciones en la tabla intermedia
                        rolPantallaRepository.saveAll(rolPantallaSet);

                        // Agregar las relaciones a la entidad Rol
                        role.getRolPantalla().addAll(rolPantallaSet);
                    }

                    List<PantallaDto> pantallaDtos = rolPantallaSet.stream()
                            .map(rolPantalla -> new PantallaDto(rolPantalla.getPantallas().getId(),
                                    rolPantalla.getPantallas().getNombre(), rolPantalla.getPantallas().getUrl()))
                            .collect(Collectors.toList());

                    RolResponseDto rolResponseDto = RolResponseDto.builder().id(role.getId()).nombre(role.getNombre())
                            .Pantallas(pantallaDtos).build();

                    return responseDtoService.buildJsonResponseObject(rolResponseDto);
                }
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe rol con el id enviado.");
            }

        } catch (Exception e) {
            // e.printStackTrace(); // Imprimir el error para ver más detalles
            return responseDtoService.buildJsonResponseString(e.getMessage());
        }

    }

    @Transactional
    public ResponseDto delete_rol(RolDeleteDto rolDeleteDto) {
        try {
            Optional<RolesEntity> rol = roleRepository.findById(rolDeleteDto.getId());
            if (rol.isPresent()) {
                RolesEntity role = rol.get();
                // Eliminar asociaciones existentes
                Set<RolPantallaEntity> existingAssociations = role.getRolPantalla();
                rolPantallaRepository.deleteAll(existingAssociations);
                existingAssociations.clear();
                roleRepository.delete(role);
                return responseDtoService.buildJsonResponseString("Rol eliminado exitosamente.");
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe rol con el id enviado.");
            }
        } catch (Exception e) {
            return responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
    }

    @Transactional
    public ResponseDto delete_rol_all(RolDeleteAllDto rolDeleteAllDto) {
        try {
            List<Integer> RolesId = rolDeleteAllDto.getIds();
            List<RolesEntity> roles = (List<RolesEntity>) roleRepository.findAllById(RolesId);
            if (roles.size() != RolesId.size()) {
                return responseDtoService.buildJsonErrorValidateResponse("Uno o más ids, no son válidos.");
            } else {
                for (RolesEntity role : roles) {
                    Set<RolPantallaEntity> existingAssociations = role.getRolPantalla();
                    rolPantallaRepository.deleteAll(existingAssociations);
                    existingAssociations.clear();
                    roleRepository.delete(role);
                }
                return responseDtoService.buildJsonResponseString("Roles eliminados correctamente.");
            }
        } catch (Exception e) {
            return responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
    }

    public ResponseDto get_roles(){
        List<RolDto> roles = roleRepository.ListRoles();
        return responseDtoService.buildJsonResponseObject(roles);
    }
}
