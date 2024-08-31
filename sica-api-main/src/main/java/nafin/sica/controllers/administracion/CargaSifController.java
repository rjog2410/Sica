package nafin.sica.controllers.administracion;

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
import nafin.sica.persistence.repositories.CanastaRepository;
import nafin.sica.service.AdministracionCargasService;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class CargaSifController {
    @Autowired
    ResponseService responseService;

    @Autowired
    CanastaRepository canastaRepository;

    @Autowired
    AdministracionCargasService administracionService;

    @PostMapping("/administracion/carga_sif")
    public Map<String, Object> get_carga_sif(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            response = administracionService.get_carga_operativa(data, "sif");
            if (response.get("status").equals("OK")) {
                response = responseService.buildJsonResponseObject(response.get("data"));
            } else {
                response = responseService.buildJsonErrorValidateResponse((String) response.get("message"));
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
