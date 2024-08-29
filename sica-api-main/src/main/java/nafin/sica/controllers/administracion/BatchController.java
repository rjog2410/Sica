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
import nafin.sica.service.AdministracionBatchService;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class BatchController {
    @Autowired
    ResponseService responseService;

    @Autowired
    AdministracionBatchService administracionBatchService;

    @PostMapping("administracion/batch")
    public Map<String, Object> batch_process(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();

        try {
            response = administracionBatchService.batch(data);
            if (response.get("status").equals("OK")) {
                response = responseService.buildJsonResponseString("OK");
            } else {
                response = responseService.buildJsonErrorValidateResponse(response.get("message").toString());
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }

        return response;
    }

}
