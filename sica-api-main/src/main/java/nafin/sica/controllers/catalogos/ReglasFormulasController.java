package nafin.sica.controllers.catalogos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.FormulasDto;
import nafin.sica.persistence.dto.ReglasDto;
import nafin.sica.persistence.repositories.CuentasConciliaRepository;
import nafin.sica.persistence.repositories.FormulasRepository;
import nafin.sica.persistence.repositories.ReglasRepository;
import nafin.sica.service.ResponseService;
import nafin.sica.service.ReglasFormulasService;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class ReglasFormulasController {
    @Autowired
    CuentasConciliaRepository cuentasConciliaRepository;

    @Autowired
    ReglasRepository reglasRepository;

    @Autowired
    FormulasRepository formulasRepository;

    @Autowired
    ResponseService responseService;

    @Autowired
    ReglasFormulasService reglasFormulasService;

    Integer id = null;
    Map<String, Object> response = new HashMap<>();

    @PostMapping("/catalogos/cuentas_regla/reglas/get")
    public Map<String, Object> get_regla(@RequestBody Map<String, Object> data) {

        try {
            id = (Integer) data.get("id");
            if (id == null || id == 0) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ReglasDto> reglas = reglasRepository.get_by_reg_cuc_clave(id);
            response = responseService.buildJsonResponseObject(reglas);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }

        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/reglas/create")
    public Map<String, Object> create_regla(@RequestBody Map<String, Object> data) {
        Map<String, Object> regla_creacion = new HashMap<>();
        regla_creacion = reglasFormulasService.validate_reglas_entity(data, "create", "reglas");
        if (regla_creacion.get("status") != "OK") {
            return response = responseService.buildJsonErrorValidateObject(regla_creacion);
        }
        response = responseService.buildJsonResponseObject(regla_creacion.get("data"));
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/reglas/update")
    public Map<String, Object> update_regla(@RequestBody Map<String, Object> data) {
        Map<String, Object> regla_creacion = new HashMap<>();
        regla_creacion = reglasFormulasService.validate_reglas_entity(data, "update", "reglas");
        if (regla_creacion.get("status") != "OK") {
            return response = responseService.buildJsonErrorValidateObject(regla_creacion);
        }
        response = responseService.buildJsonResponseObject(regla_creacion.get("data"));
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/reglas/delete_all")
    public Map<String, Object> delete_regla_all(@RequestBody List<Map<String, Object>> data) {
        Map<String, Object> delete_regla = new HashMap<>();

        try {
            delete_regla = reglasFormulasService.delete(data, "reglas");
            if (delete_regla.get("status") != "OK") {
                return response = responseService.buildJsonResponseObject(delete_regla.get("message"));
            }
            Integer result = (Integer) delete_regla.get("message");
            if (data.size() == result) {
                response = responseService.buildJsonResponseString("Exitoso");
            } else {
                response = responseService.buildJsonResponseString(
                        "1 ó mas registros no fueron eliminados, favor de revisar su información");
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;

    }

    @PostMapping("/catalogos/cuentas_regla/reglas/delete")
    public Map<String, Object> delete_regla(@RequestBody Map<String, Object> data) {
        Map<String, Object> delete_regla = new HashMap<>();

        try {
            delete_regla = reglasFormulasService.delete_one(data, "reglas");
            if (delete_regla.get("status") != "OK") {
                return response = responseService.buildJsonResponseObject(delete_regla.get("message"));
            }
            response = responseService.buildJsonResponseString("Exitoso");

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;

    }

    @PostMapping("/catalogos/cuentas_regla/formulas/get")
    public Map<String, Object> get_formula(@RequestBody Map<String, Object> data) {
        try {
            id = (Integer) data.get("id");
            if (id == null || id == 0) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<FormulasDto> formulas = formulasRepository.get_by_for_cuc_clave(id);
            response = responseService.buildJsonResponseObject(formulas);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/formulas/create")
    public Map<String, Object> create_formula(@RequestBody Map<String, Object> data) {
        Map<String, Object> formula_creacion = new HashMap<>();
        formula_creacion = reglasFormulasService.validate_reglas_entity(data, "create", "formulas");
        if (formula_creacion.get("status") != "OK") {
            return response = responseService.buildJsonErrorValidateObject(formula_creacion);
        }
        response = responseService.buildJsonResponseObject(formula_creacion.get("data"));
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/formulas/update")
    public Map<String, Object> update_formula(@RequestBody Map<String, Object> data) {
        Map<String, Object> formula_creacion = new HashMap<>();
        formula_creacion = reglasFormulasService.validate_reglas_entity(data, "update", "formulas");
        if (formula_creacion.get("status") != "OK") {
            return response = responseService.buildJsonErrorValidateObject(formula_creacion);
        }
        response = responseService.buildJsonResponseObject(formula_creacion.get("data"));
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/formulas/delete_all")
    public Map<String, Object> delete_formula_all(@RequestBody List<Map<String, Object>> data) {
        Map<String, Object> delete_regla = new HashMap<>();
        try {
            delete_regla = reglasFormulasService.delete(data, "formulas");
            if (delete_regla.get("status") != "OK") {
                return response = responseService.buildJsonResponseObject(delete_regla.get("message"));
            }
            Integer result = (Integer) delete_regla.get("message");
            if (data.size() == result) {
                response = responseService.buildJsonResponseString("Exitoso");
            } else {
                response = responseService.buildJsonResponseString(
                        "1 ó mas registros no fueron eliminados, favor de revisar su información");
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;

    }

    @PostMapping("/catalogos/cuentas_regla/formulas/delete")
    public Map<String, Object> delete_formula(@RequestBody Map<String, Object> data) {
        Map<String, Object> delete_regla = new HashMap<>();
        try {
            delete_regla = reglasFormulasService.delete_one(data, "formulas");
            if (delete_regla.get("status") != "OK") {
                return response = responseService.buildJsonResponseObject(delete_regla.get("message"));
            }
            response = responseService.buildJsonResponseString("Exitoso");

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;

    }

}
