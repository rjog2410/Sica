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
import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.repositories.UserRepository;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class UsuariosController {

    @Autowired
    ResponseService responseService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @PostMapping("/seguridad/usuarios/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid UserEntity user) {
        ResponseDto response = new ResponseDto();
        try {
            userRepository.save(user);
            response = responseDtoService.buildJsonResponse();
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/usuarios/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid UserEntity user) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (user.getId().equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<UserEntity> userUpdate = userRepository.findById(user.getId());
                if (userUpdate.isPresent()) {
                    userRepository.save(user);
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/usuarios/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody Map<String, Integer> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("id").equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                Optional<UserEntity> userUpdate = userRepository.findById(data.get("id"));
                if (userUpdate.isPresent()) {
                    userRepository.deleteById(data.get("id"));
                    response = responseDtoService.buildJsonResponse();
                } else {
                    response = responseDtoService.buildJsonErrorValidateResponse("No existe usuario con el Id enviado.");
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/usuarios/delete_all")
    public ResponseEntity<ResponseDto> delete_all(@RequestBody Map<String, List<Integer>> data) {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        try {
            if (data.get("ids").equals(null)) {
                response = responseDtoService.buildJsonErrorValidateResponse("El Id no debe ser nulo.");
            } else {
                List<UserEntity> users = (List<UserEntity>) userRepository.findAllById(data.get("ids"));
                if (users.size() != data.get("ids").size()) {
                    response = responseDtoService.buildJsonErrorValidateResponse("Uno o más Ids no son válidos");
                } else {
                    userRepository.deleteAllById(data.get("ids"));
                    response = responseDtoService.buildJsonResponse();
                }
            }
        } catch (Exception e) {
            response = responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
        return ResponseEntity.ok().body(response);
    }



}
