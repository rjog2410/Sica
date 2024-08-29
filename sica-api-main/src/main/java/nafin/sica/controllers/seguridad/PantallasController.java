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
import nafin.sica.persistence.entity.PantallasEntity;
import nafin.sica.persistence.repositories.PantallaRepository;
import nafin.sica.service.ResponseDtoService;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class PantallasController {
     @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    PantallaRepository pantallaRepository;


     @PostMapping("/seguridad/pantallas/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid PantallasEntity pantalla) {
        ResponseDto response = new ResponseDto();
        try {
            pantallaRepository.save(pantalla);
            response = responseDtoService.buildJsonResponse();
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/pantallas/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid PantallasEntity pantalla) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (pantalla.getId().equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<PantallasEntity> pantallaUpdate = pantallaRepository.findById(pantalla.getId());
                if (pantallaUpdate.isPresent()) {
                    pantallaRepository.save(pantalla);
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
    @PostMapping("/seguridad/pantallas/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody Map<String, Integer> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("id").equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<PantallasEntity> pantOptional = pantallaRepository.findById(data.get("id"));
                if (pantOptional.isPresent()) {
                    pantallaRepository.deleteById(data.get("id"));
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe Pantalla con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/pantallas/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody Map<String, List<Integer>> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("ids").equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                List<PantallasEntity> pantallas = (List<PantallasEntity>) pantallaRepository.findAllById(data.get("ids"));
                if (pantallas.size() != data.get("ids").size()) {
                    response = responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids no son válidos");
                } else {
                    pantallaRepository.deleteAllById(data.get("ids"));
                    response = responseDtoService.buildJsonResponse();
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

}
