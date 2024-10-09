package nafin.sica.controllers.seguridad;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteIdDto;
import nafin.sica.persistence.dto.ValidationsDto.MenuRequestDto;
import nafin.sica.persistence.repositories.MenusRepository;
import nafin.sica.service.MenuService;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class MenusController {
    @Autowired
    MenusRepository menusRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    Utils utils;

    @Autowired
    MenuService menuService;

    @Transactional
    @PostMapping("/seguridad/menus/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid MenuRequestDto menu) {
        return ResponseEntity.ok().body(menuService.create(menu));
    }

    @Transactional
    @PostMapping("/seguridad/menus/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid MenuRequestDto menu) {
        return ResponseEntity.ok().body(menuService.update(menu));
    }

    @Transactional
    @PostMapping("/seguridad/menus/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid DeleteIdDto menu) {
        return ResponseEntity.ok().body(menuService.delete(menu));
    }

    @Transactional
    @PostMapping("/seguridad/menus/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody @Valid DeleteAllDto deleteAllDto) {
        return ResponseEntity.ok().body(menuService.delete_all(deleteAllDto));
    }
    @PostMapping("/seguridad/menus/get")
    public ResponseEntity<ResponseDto> get() {
        return ResponseEntity.ok().body(menuService.getMenus());
    }
}
