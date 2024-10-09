package nafin.sica.controllers.procesos;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.repositories.ExtractorSifRepository;
import nafin.sica.service.ExtractorService;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class ExtractorSifController {

    @Autowired
    ResponseService responseService;

    @Autowired
    ExtractorSifRepository extractorSifRepository;

    @Autowired
    EntityManager entityManager;

    @Autowired
    ExtractorService extractorService;

    @PostMapping("/procesos/extractor_sif/get")
    public Map<String, Object> get_extractor(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Thread.sleep(5000);
            response = extractorService.validate_data(data, "extractor");
            if (!response.get("status").equals("OK")) {
                return response = responseService.buildJsonErrorValidateResponse((String) response.get("message"));
            }
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate date_inicial = LocalDate.parse((String) data.get("fecha_inicial"), formatter);
            LocalDate date_final = LocalDate.parse((String) data.get("fecha_final"), formatter);

            String tipo_info = (String) data.get("tipo_informacion");

            StoredProcedureQuery sp = entityManager.createStoredProcedureQuery("SICA.SICAP002.obten_cuentas_conciliar");
            sp.registerStoredProcedureParameter("sistema", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("modulo", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("fecha_inicial", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("fecha_final", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("saldos", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("movimientos", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("borrar_info", String.class, ParameterMode.IN);
            sp.setParameter("sistema", data.get("sistema").equals("Todos") ? "%" : (String) data.get("sistema"));
            sp.setParameter("modulo", data.get("modulo").equals("Todos") ? "%" : (String) data.get("modulo"));
            sp.setParameter("fecha_inicial", formatter.format(date_inicial));
            sp.setParameter("fecha_final", formatter.format(date_final));
            sp.setParameter("saldos", tipo_info.equals("S") ? "S" : "N");
            sp.setParameter("movimientos", tipo_info.equals("M") ? "S" : "N");
            sp.setParameter("borrar_info", (String) data.get("borrar_info"));
            sp.execute();
        } catch (Exception e) {
            return response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response = responseService.buildJsonResponseString("OK");

    }

}
