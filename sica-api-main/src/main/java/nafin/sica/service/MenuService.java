package nafin.sica.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.MenuDto;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteIdDto;
import nafin.sica.persistence.dto.ValidationsDto.MenuRequestDto;
import nafin.sica.persistence.entity.MenusEntity;
import nafin.sica.persistence.entity.PantallasEntity;
import nafin.sica.persistence.repositories.MenusRepository;
import nafin.sica.persistence.repositories.PantallaRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class MenuService {

    @Autowired
    Utils utils;

    @Autowired
    MenusRepository menusRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    PantallaRepository pantallaRepository;

    @Transactional
    public ResponseDto create(MenuRequestDto menuRequestDto) {
        if (menusRepository.validateUrl(menuRequestDto.getUrl()).isPresent()) {
            return responseDtoService.buildJsonErrorValidateResponse("La url debe ser única.");
        } else {
            MenusEntity menu = MenusEntity.builder().nombre(menuRequestDto.getNombre()).orden(menuRequestDto.getOrden())
                    .tipo(menuRequestDto.getTipo()).url(menuRequestDto.getUrl()).build();
            menusRepository.save(menu);
            return responseDtoService.buildJsonResponseObject(menu);
        }
    }

    @Transactional
    public ResponseDto update(MenuRequestDto menuRequestDto) {
        if (utils.isNullOrZero(menuRequestDto.getId())) {
            return responseDtoService.buildJsonErrorValidateResponse("El id enviado no es válido.");
        } else {
            // id es valido.
            // validar url unico
            Optional<MenusEntity> menuOptional = menusRepository.findById(menuRequestDto.getId());
            if (menuOptional.isPresent()) {
                if (menusRepository.validateUrlWithId(menuRequestDto.getId(), menuRequestDto.getUrl()).isPresent()) {
                    // ya existe la url
                    return responseDtoService.buildJsonResponseString("El url debe ser único.");
                } else {
                    // update valido
                    MenusEntity menu = menuOptional.get();
                    menu.setNombre(menuRequestDto.getNombre());
                    menu.setOrden(menuRequestDto.getOrden());
                    menu.setTipo(menuRequestDto.getTipo());
                    menu.setUrl(menuRequestDto.getUrl());
                    menusRepository.save(menu);
                    return responseDtoService.buildJsonResponseString("Menu actualizado correctamente");
                }
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe menu con el Id enviado.");
            }
        }
    }

    @Transactional
    public ResponseDto delete(DeleteIdDto menuRequestDto) {
        if (utils.isNullOrZero(menuRequestDto.getId())) {
            return responseDtoService.buildJsonErrorValidateResponse("El id enviado no es válido.");
        } else {// id valido
            Optional<MenusEntity> menuOptional = menusRepository.findById(menuRequestDto.getId());
            if (menuOptional.isPresent()) {
                MenusEntity menu = menuOptional.get();
                Set<PantallasEntity> pantallas = menu.getPantallas();
                for (PantallasEntity pantalla : pantallas) {
                    pantallaRepository.delete(pantalla);
                }
                menusRepository.delete(menu);
                ;
                return responseDtoService.buildJsonResponseString("Menu eliminado correctamente.");
            } else {
                return responseDtoService.buildJsonErrorValidateResponse("No existe registro con el id enviado.");
            }
        }

    }

    @Transactional
    public ResponseDto delete_all(DeleteAllDto deleteAllDto) {
        // validar los ids
        List<MenusEntity> Menus = (List<MenusEntity>) menusRepository.findAllById(deleteAllDto.getIds());
        if (Menus.size() != deleteAllDto.getIds().size()) {
            return responseDtoService.buildJsonErrorValidateResponse("Uno o más ids no son válidos.");
        } else {
            for (MenusEntity menu : Menus) {
                Set<PantallasEntity> pantallas = menu.getPantallas();
                for (PantallasEntity pantalla : pantallas) {
                    pantallaRepository.delete(pantalla);
                }
                menusRepository.delete(menu);

            }
            return responseDtoService.buildJsonResponseString("Menus eliminados correctamente.");
        }
    }

    public ResponseDto getMenus() {
        List<MenuDto> menus = menusRepository.getMenus();
        return responseDtoService.buildJsonResponseObject(menus);
    }

}
