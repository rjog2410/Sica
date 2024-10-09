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
import nafin.sica.persistence.dto.ValidationsDto.PantallaRequestDto;
import nafin.sica.persistence.repositories.PantallaRepository;
import nafin.sica.service.PantallaService;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class PantallasController {
    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    PantallaRepository pantallaRepository;

    @Autowired
    Utils utils;

    @Autowired
    PantallaService pantallaService;

    @PostMapping("/seguridad/pantallas/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid PantallaRequestDto pantalla) {
        return ResponseEntity.ok().body(pantallaService.create(pantalla));
    }

    @PostMapping("/seguridad/pantallas/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid PantallaRequestDto pantalla) {
        return ResponseEntity.ok().body(pantallaService.update(pantalla));
    }

    @Transactional
    @PostMapping("/seguridad/pantallas/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid DeleteIdDto id) {
        return ResponseEntity.ok().body(pantallaService.delete(id));
    }

    @Transactional
    @PostMapping("/seguridad/pantallas/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody @Valid DeleteAllDto ids) {
        return ResponseEntity.ok().body(pantallaService.delete_all(ids));
    }

    @PostMapping("/seguridad/pantallas/get")
    public ResponseEntity<ResponseDto> getPantallas(){
        return ResponseEntity.ok().body(pantallaService.get_pantallas_with_menu());
    }

}
