package nafin.sica.controllers.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.service.SesionService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class SesionController {
    @Autowired
    Utils utils;

    @Autowired
    SesionService sesionService;

    @PostMapping("/session/getUserData")
    public ResponseEntity<ResponseDto> get_data_user(@RequestHeader("Authorization") String header){
        return ResponseEntity.ok().body(sesionService.get_user_info(header));
    }



}
