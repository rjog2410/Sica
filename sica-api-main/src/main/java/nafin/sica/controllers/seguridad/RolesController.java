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
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.entity.RolesEntity;
import nafin.sica.persistence.repositories.RoleRepository;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class RolesController {
    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    Utils utils;

    @PostMapping("/seguridad/roles/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid RolesEntity role) {
        ResponseDto response = new ResponseDto();
        try {
            roleRepository.save(role);
            response = responseDtoService.buildJsonResponse();
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/roles/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid RolesEntity role) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (utils.isNullOrZero(role.getId())) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<RolesEntity> roleUpdate = roleRepository.findById(role.getId());
                if (roleUpdate.isPresent()) {
                    roleRepository.save(role);
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe rol con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/roles/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody Map<String, Integer> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (utils.isNullOrZero(data.get("id"))) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<RolesEntity> userUpdate = roleRepository.findById(data.get("id"));
                if (userUpdate.isPresent()) {
                    roleRepository.deleteById(data.get("id"));
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe Rol con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/roles/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody Map<String, List<Integer>> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("ids") == null) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                List<RolesEntity> users = (List<RolesEntity>) roleRepository.findAllById(data.get("ids"));
                if (users.size() != data.get("ids").size()) {
                    response = responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids no son válidos");
                } else {
                    roleRepository.deleteAllById(data.get("ids"));
                    response = responseDtoService.buildJsonResponse();
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok().body(response);
    }

}
