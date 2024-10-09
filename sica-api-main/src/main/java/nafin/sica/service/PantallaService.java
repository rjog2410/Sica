package nafin.sica.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.PantallaMenuDto;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteIdDto;
import nafin.sica.persistence.dto.ValidationsDto.PantallaRequestDto;
import nafin.sica.persistence.entity.MenusEntity;
import nafin.sica.persistence.entity.PantallasEntity;
import nafin.sica.persistence.entity.RolPantallaEntity;
import nafin.sica.persistence.entity.UserPantallaEntity;
import nafin.sica.persistence.repositories.MenusRepository;
import nafin.sica.persistence.repositories.PantallaRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class PantallaService {

    @Autowired
    Utils utils;

    @Autowired
    PantallaRepository pantallaRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    MenusRepository menusRepository;

    @Transactional
    public ResponseDto create(PantallaRequestDto pantallaRequest) {
        // validar la url que sea unica
        Optional<PantallasEntity> validarOptional = pantallaRepository.validarUrl(pantallaRequest.getUrl());
        if (validarOptional.isPresent()) {
            return responseDtoService.buildJsonErrorValidateResponse("La url debe ser única.");
        }
        // validamos el menu al que se va crear
        Optional<MenusEntity> menuOptional = menusRepository.findById(pantallaRequest.getId_menu());
        if (menuOptional.isPresent()) {
            MenusEntity menu = menuOptional.get();
            PantallasEntity pantalla = PantallasEntity.builder().informacion(pantallaRequest.getInformacion())
                    .nombre(pantallaRequest.getNombre()).tipo(pantallaRequest.getTipo()).url(pantallaRequest.getUrl())
                    .menu(menu).build();
            Set<PantallasEntity> setPantalla = menu.getPantallas();
            setPantalla.add(pantalla);
            pantallaRepository.save(pantalla);
            menu.setPantallas(setPantalla);
            menusRepository.save(menu);
            return responseDtoService.buildJsonResponseString("Pantalla creada correctamente.");
        } else {
            return responseDtoService.buildJsonErrorValidateResponse("El id del menu no es válido.");
        }

    }

    @Transactional
    public ResponseDto update(PantallaRequestDto pantallaRequestDto) {
        // validar id
        if (utils.isNullOrZero(pantallaRequestDto.getId())) {
            return responseDtoService.buildJsonErrorValidateResponse("El id no debe ser nulo.");
        }
        // validar la url que sea unica
        Optional<PantallasEntity> validarOptional = pantallaRepository.validarUrlUpdate(pantallaRequestDto.getUrl(),
                pantallaRequestDto.getId());
        if (validarOptional.isPresent()) {
            return responseDtoService.buildJsonErrorValidateResponse("La url debe ser única.");
        } else {
            Optional<PantallasEntity> pantalOptional = pantallaRepository.findById(pantallaRequestDto.getId());
            if (pantalOptional.isPresent()) {
                Optional<MenusEntity> menuOptional = menusRepository.findById(pantallaRequestDto.getId_menu());
                if (menuOptional.isPresent()) {
                    MenusEntity menu = menuOptional.get();
                    PantallasEntity pantalla = pantalOptional.get();
                    pantalla.setInformacion(pantallaRequestDto.getInformacion());
                    pantalla.setNombre(pantallaRequestDto.getNombre());
                    pantalla.setTipo(pantallaRequestDto.getTipo());
                    pantalla.setMenu(menu);
                    pantalla.setUrl(pantallaRequestDto.getUrl());
                    pantallaRepository.save(pantalla);
                    return responseDtoService.buildJsonResponseString("Pantalla actualizado correctamente.");
                } else {
                    return responseDtoService.buildJsonErrorValidateResponse("El id del menu no es válido.");
                }
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe registro con el Id enviado.");
            }
        }
    }

    @Transactional
    public ResponseDto delete(DeleteIdDto deleteIdDto) {
        // validamos que existe la pantalla.
        Optional<PantallasEntity> pantallaOptional = pantallaRepository.findById(deleteIdDto.getId());
        if (pantallaOptional.isPresent()) {
            PantallasEntity pantalla = pantallaOptional.get();
            Set<RolPantallaEntity> setPantallaRol = pantalla.getRolPantallas();
            Set<UserPantallaEntity> setPantallaUser = pantalla.getUserPantalla();
            if (!setPantallaRol.isEmpty()) {
                return responseDtoService.buildJsonErrorValidateResponse("Esta pantalla está asociada a un rol.");
            }
            if (!setPantallaUser.isEmpty()) {
                return responseDtoService.buildJsonErrorValidateResponse("Esta pantalla está asociada a un usuario.");
            }
            pantallaRepository.delete(pantalla);
            return responseDtoService.buildJsonResponseString("Registro eliminado exitosamente.");
        } else {
            return responseDtoService.buildJsonErrorValidateResponse("No existe registro con el Id enviado.");
        }
    }

    @Transactional
    public ResponseDto delete_all(DeleteAllDto ids) {
        // Validamos existencias de pantallas
        List<PantallasEntity> Pantallas = (List<PantallasEntity>) pantallaRepository.findAllById(ids.getIds());
        // String msg = "";
        StringBuilder msg = new StringBuilder();
        for (PantallasEntity pantalla : Pantallas) {
            Set<RolPantallaEntity> setPantallaRol = pantalla.getRolPantallas();
            Set<UserPantallaEntity> setPantallaUser = pantalla.getUserPantalla();
            if (!setPantallaRol.isEmpty()) {
                // msg = "La pantalla con el id " + pantalla.getId() + " - " +
                // pantalla.getNombre()
                // + " está asociada a un rol.";
                msg.append("La pantalla con el id ").append(pantalla.getId()).append(" - ").append(pantalla.getNombre())
                        .append(" está asociada a un rol.\n");
            }
            if (!setPantallaUser.isEmpty()) {
                // msg = "La pantalla con el id " + pantalla.getId() + " - " +
                // pantalla.getNombre()
                // + " está asociada a un usuario.";
                msg.append("La pantalla con el id ").append(pantalla.getId()).append(" - ").append(pantalla.getNombre())
                        .append(" está asociada a un usuario.\n");
            }
        }
        if (msg.length() > 0) {
            return responseDtoService.buildJsonErrorValidateResponse(msg.toString());
        } else {
            for (PantallasEntity pantalla : Pantallas) {
                pantallaRepository.delete(pantalla);
            }
            return responseDtoService.buildJsonResponseString("Registros eliminados exitosamente.");
        }

    }

    public ResponseDto get_pantallas_with_menu(){
        List<PantallasEntity> pantallas = (List<PantallasEntity>) pantallaRepository.findAll();
        List<PantallaMenuDto> PantallasDto = pantallas.stream().map(pantalla -> new PantallaMenuDto(
                pantalla.getId(),
                pantalla.getNombre(),
                pantalla.getMenu() != null ? pantalla.getMenu().getId() : null, // Manejar caso nulo
                pantalla.getMenu() != null ? pantalla.getMenu().getNombre() : null // Manejar caso nulo
        )).collect(Collectors.toList());
        return responseDtoService.buildJsonResponseObject(PantallasDto);
    }

}
