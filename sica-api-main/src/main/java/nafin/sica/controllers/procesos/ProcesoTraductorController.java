package nafin.sica.controllers.procesos;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ModulosCatalogosDto;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.SistemDto;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ExtractorService;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.ResponseService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class ProcesoTraductorController {
    @Autowired
    ExtractorService extractorService;

    @Autowired
    ResponseService responseService;

    @Autowired
    EntityManager entityManager;

    @Autowired
    SistemasRepository sistemasRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    Utils utils;

    @Autowired
    ModuloRepository moduloRepository;

    @PostMapping("/procesos/traductor/get")
    public Map<String, Object> get_traductor(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
       
        try {
            // Thread.sleep(5000);
            response = extractorService.validate_data(data, "traductor");
            if (!response.get("status").equals("OK")) {
                return response = responseService.buildJsonErrorValidateResponse((String) response.get("message"));
            }
            if (data.get("sistema").equals("TODOS")) {
                data.put("modulo", "TODOS");
            }

            String tipo_info = (String) data.get("tipo_informacion");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate date_inicial = LocalDate.parse((String) data.get("fecha_inicial"), formatter);
            LocalDate date_final = LocalDate.parse((String) data.get("fecha_final"), formatter);
            StoredProcedureQuery sp = entityManager.createStoredProcedureQuery("SICA.SICAP001.asigna_nulo_importe");
            sp.registerStoredProcedureParameter("sistema", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("modulo", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("fecha_inicial", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("fecha_final", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("saldos", String.class, ParameterMode.IN);
            sp.registerStoredProcedureParameter("movimientos", String.class, ParameterMode.IN);
            sp.setParameter("sistema", data.get("sistema").equals("TODOS") ? "%" : (String) data.get("sistema"));
            sp.setParameter("modulo", data.get("modulo").equals("TODOS") ? "%" : (String) data.get("modulo"));
            sp.setParameter("fecha_inicial", formatter.format(date_inicial));
            sp.setParameter("fecha_final", formatter.format(date_final));
            sp.setParameter("saldos", tipo_info.equals("S") ? "S" : "N");
            sp.setParameter("movimientos", tipo_info.equals("M") ? "S" : "N");
            sp.execute();
        } catch (Exception e) {
            return response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response = responseService.buildJsonResponseString("OK");

    }

    @PostMapping("/procesos/traductor/get_sistems")
    public ResponseEntity<ResponseDto> get_sistems() {
        try {
            List<SistemDto> sistemOptional = sistemasRepository.findAllBySisClaveOnlyName();
            return ResponseEntity.ok().body(responseDtoService.buildJsonResponseObject(sistemOptional));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/procesos/traductor/get_module")
    public ResponseEntity<ResponseDto> get_module(@RequestBody Map<String, Object> data) {
        String mod_sis_clave;
        try {
            mod_sis_clave = (String) data.get("mod_sis_clave");
            if (utils.isNullOrEmpty(mod_sis_clave)) {
                return ResponseEntity.ok().body(
                        responseDtoService.buildJsonErrorValidateResponse("La clave de sistema no puede ser nulo."));
            }
            List<ModulosCatalogosDto> modulosDTOs = moduloRepository.getModule(mod_sis_clave);
            return ResponseEntity.ok().body(responseDtoService.buildJsonResponseObject(modulosDTOs));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

}
