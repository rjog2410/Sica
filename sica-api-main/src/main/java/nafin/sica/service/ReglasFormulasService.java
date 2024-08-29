package nafin.sica.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.FormulasDto;
import nafin.sica.persistence.dto.ReglasDto;
import nafin.sica.persistence.entity.FormulasEntity;
import nafin.sica.persistence.entity.FormulasId;
import nafin.sica.persistence.entity.ReglasEntity;
import nafin.sica.persistence.entity.ReglasId;
import nafin.sica.persistence.repositories.FormulasRepository;
import nafin.sica.persistence.repositories.ReglasRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class ReglasFormulasService {
    @Autowired
    ResponseService responseService;

    @Autowired
    ReglasRepository reglasRepository;

    @Autowired
    FormulasRepository formulasRepository;

    @Autowired
    Utils utils;

    String msg = null;
    String status = null;
    Integer clave_cuenta = null;
    String sis_clave = null;
    String mod_clave = null;
    Integer columna = null;
    Integer secuencia = null;
    String operador = null;
    String valor = null;
    Integer total_delete = 0;

    @Transactional
    public Map<String, Object> validate_reglas_entity(Map<String, Object> data, String action, String origin) {
        Map<String, Object> response = new HashMap<>();
        try {
            response = validate_data(action, data, origin);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return response;
    }

    public void get_data_reglas(Map<String, Object> data) {
        clave_cuenta = (Integer) data.get("reg_cuc_clave");
        sis_clave = (String) data.get("reg_tit_mod_sis_clave");
        mod_clave = (String) data.get("reg_tit_mod_clave");
        columna = (Integer) data.get("reg_tit_columna");
        secuencia = (Integer) data.get("reg_secuencia");
        operador = (String) data.get("reg_operador");
        valor = (String) data.get("reg_valor");
    }

    public void get_data_formula(Map<String, Object> data) {
        clave_cuenta = (Integer) data.get("for_cuc_clave");
        sis_clave = (String) data.get("for_tit_mod_sis_clave");
        mod_clave = (String) data.get("for_tit_mod_clave");
        columna = (Integer) data.get("for_tit_columna");
        secuencia = (Integer) data.get("for_secuencia");
        operador = (String) data.get("for_operador");
    }

    public Map<String, Object> validate_data(String action, Map<String, Object> data, String origin) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data2 = new HashMap<>();
        try {
            if (origin.equals("reglas")) {
                get_data_reglas(data);
            } else {
                get_data_formula(data);
            }
            status = "OK";
            if (utils.isNullOrZero(clave_cuenta)) {
                status = "Error";
                msg = "La cuenta no debe ser nulo";
            } else if (utils.isNullOrEmpty(sis_clave)) {
                status = "Error";
                msg = "La clave del sistema no debe ser nulo";
            } else if (utils.isNullOrEmpty(mod_clave)) {
                status = "Error";
                msg = "La clave del modulo no debe ser nulo";
            } else if (utils.isNullOrZero(columna)) {
                status = "Error";
                msg = "La columna no debe ser nulo y no mayor a 2 dígitos";
            } else if (utils.isNullOrZero(secuencia)) {
                status = "Error";
                msg = "La secuencia no debe ser nulo y no mayor de 6 dígitos";
            }

            if (utils.isNullOrEmpty(operador)) {
                status = "Error";
                msg = "El  operador no debe ser nulo.";
            } else {
                if (operador.length() > 2) {
                    status = "Error";
                    msg = "El operador no debe ser mayor de 2 caracteres.";
                }
            }
            if (origin.equals("reglas")) {
                if (utils.isNullOrEmpty(valor)) {
                    status = "Error";
                    msg = "El valor no debe ser nulo";
                } else {
                    if (valor.length() > 10) {
                        status = "Error";
                        msg = "El valor no debe ser mayor de 10 caracteres.";
                    }
                }
                Optional<ReglasDto> reglasEntity = reglasRepository.get_regla_by_Id(clave_cuenta, sis_clave, mod_clave,
                        columna, secuencia);
                if (reglasEntity.isPresent() && status == "OK") {
                    if (action.equals("update")) {
                        data2 = save_data();
                    } else {
                        status = "Error";
                        msg = "Existe un registro con los datos enviados.";
                    }

                } else {
                    if (action.equals("create")) {
                        data2 = save_data();
                    } else {
                        status = "Error";
                        msg = "No existe registro con los datos solicitados";
                    }
                }
            } else {
                Optional<FormulasDto> formulasOptional = formulasRepository.get_formula_by_Id(clave_cuenta, sis_clave,
                        mod_clave, columna, secuencia);
                if (formulasOptional.isPresent() && status.equals("OK")) {
                    if (action.equals("update")) {
                        data2 = save_data_formulas();
                    } else {
                        status = "Error";
                        msg = "Existe un registro con los datos enviados.";
                    }

                } else {
                    if (action.equals("create")) {
                        data2 = save_data_formulas();
                    } else {
                        status = "Error";
                        msg = "No existe registro con los datos solicitados";
                    }
                }
            }

        } catch (

        Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("msg", msg);
        response.put("data", data2.get("data"));
        return response;
    }

    public Map<String, Object> save_data() {
        Map<String, Object> data2 = new HashMap<>();
        try {
            ReglasId reglasId = ReglasId.builder().reg_cuc_clave(clave_cuenta).reg_tit_mod_sis_clave(sis_clave)
                    .reg_tit_mod_clave(mod_clave).reg_tit_columna(columna).reg_secuencia(secuencia).build();

            ReglasEntity reglasEntity = ReglasEntity.builder().id(reglasId).reg_operador(operador).reg_valor(valor)
                    .build();
            reglasRepository.save(reglasEntity);
            data2.put("data", reglasId);

        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return data2;
    }

    public Map<String, Object> save_data_formulas() {
        Map<String, Object> data = new HashMap<>();
        try {
            FormulasId formulasId = FormulasId.builder().for_cuc_clave(clave_cuenta).for_tit_mod_sis_clave(sis_clave)
                    .for_tit_mod_clave(mod_clave).for_tit_columna(columna).for_secuencia(secuencia).build();
            FormulasEntity formulasEntity = FormulasEntity.builder().for_operador(operador).id(formulasId).build();
            formulasRepository.save(formulasEntity);
            data.put("data", formulasEntity);

        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return data;
    }

    public Map<String, Object> delete(List<Map<String, Object>> data, String origin) {
        Map<String, Object> response = new HashMap<>();
        try {
            response = validate_delete(data, origin);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return response;
    }

    public Map<String, Object> delete_one(Map<String, Object> data, String origin) {
        Map<String, Object> response = new HashMap<>();
        try {
            response = validate_delete_one(data, origin);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return response;
    }

    public Map<String, Object> validate_delete(List<Map<String, Object>> list_data, String origin) {
        Map<String, Object> response = new HashMap<>();

        try {

            status = "OK";
            msg = "OK";
            if (origin == "reglas") {
                list_data.stream().forEach(data -> {
                    get_data_reglas(data);
                    total_delete = total_delete
                            + reglasRepository.deleteReglas(clave_cuenta, sis_clave, mod_clave, columna, secuencia);
                });

            } else {
                list_data.stream().forEach(data -> {
                    get_data_formula(data);
                    formulasRepository.delete_formula(clave_cuenta, sis_clave, mod_clave, columna, secuencia);
                });
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", total_delete);
        return response;
    }

    public Map<String, Object> validate_delete_one(Map<String, Object> data, String origin) {
        Map<String, Object> response = new HashMap<>();

        try {
            status = "OK";
            msg = "OK";
            if (origin == "reglas") {
                get_data_reglas(data);
                total_delete = total_delete
                        + reglasRepository.deleteReglas(clave_cuenta, sis_clave, mod_clave, columna, secuencia);
            } else {
                get_data_formula(data);
                formulasRepository.delete_formula(clave_cuenta, sis_clave, mod_clave, columna, secuencia);
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", total_delete);
        return response;
    }

    public Map<String, Object> delete_all(List<Map<String, Object>> data_all, String origin) {
        Map<String, Object> response = new HashMap<>();
        try {
            response = validate_delete_all(data_all, origin);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return response;
    }

    @Transactional
    private Map<String, Object> validate_delete_all(List<Map<String, Object>> data_all, String origin) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (origin == "reglas") {
                data_all.stream().forEach(data -> {
                    get_data_reglas(data);
                    reglasRepository.deleteReglas(clave_cuenta, sis_clave, mod_clave, columna, secuencia);
                });
                status = "OK";
                msg = "OK";
            } else {

            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        return response;
    }

}
