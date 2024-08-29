package nafin.sica.controllers.consultas;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.repositories.ConciliacionesRepository;
import nafin.sica.service.ConsultasService;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class ConciliacionSaldosController {
    @Autowired
    ConciliacionesRepository conciliacionesRepository;

    @Autowired
    ConsultasService consultasService;

    @Autowired
    ResponseService responseService;

    String sistema = null;
    String modulo = null;
    String con_fecha = null;

    @PostMapping("/consultas/conciliacion_saldos/get_data")
    Map<String, Object> get_data(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        try {
            result = consultasService.get_conciliacion_saldos(data);
            if ((String) result.get("status") == "OK") {
                response = responseService.buildJsonResponseObject(result.get("data"));
            } else {
                response = responseService.buildJsonErrorValidateResponse((String)result.get("message"));
            }
        } catch (Exception e) {
            return response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
