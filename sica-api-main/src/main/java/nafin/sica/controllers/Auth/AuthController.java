package nafin.sica.controllers.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class AuthController {
    @Autowired
    Utils utils;

    @Autowired
    ResponseDtoService responseDtoService;

    @PostMapping("auth/validateToken")
    public ResponseEntity<ResponseDto> validateToken() {
        return ResponseEntity.ok().body(responseDtoService.buildJsonResponseString("Token Válido"));
    }

}
