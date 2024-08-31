package nafin.sica.controllers.seguridad;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import nafin.sica.persistence.entity.MenusEntity;
import nafin.sica.persistence.repositories.MenusRepository;
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

    @PostMapping("/seguridad/menus/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid MenusEntity menu) {
        ResponseDto response = new ResponseDto();
        try {
            menusRepository.save(menu);
            response = responseDtoService.buildJsonResponse();
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/menus/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid MenusEntity menu) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (utils.isNullOrZero(menu.getId())) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<MenusEntity> menuUpdate = menusRepository.findById(menu.getId());
                if (menuUpdate.isPresent()) {
                    menusRepository.save(menu);
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe Menu con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/menus/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody Map<String, Integer> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (utils.isNullOrZero(data.get("id"))) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<MenusEntity> menuOptional = menusRepository.findById(data.get("id"));
                if (menuOptional.isPresent()) {
                    menusRepository.deleteById(data.get("id"));
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe Menu con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/menus/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody Map<String, List<Integer>> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("ids") == null) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                List<MenusEntity> menus = (List<MenusEntity>) menusRepository.findAllById(data.get("ids"));
                if (menus.size() != data.get("ids").size()) {
                    response = responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids no son válidos");
                } else {
                    menusRepository.deleteAllById(data.get("ids"));
                    response = responseDtoService.buildJsonResponse();
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

}
