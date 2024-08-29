package nafin.sica.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nafin.sica.persistence.entity.BatchEntity;
import nafin.sica.persistence.entity.BatchID;
import nafin.sica.persistence.repositories.BatchProcessRepository;
import nafin.sica.persistence.repositories.BatchRepository;

@Service
public class AdministracionBatchService {

    @Autowired
    Utils utils;

    @Autowired
    BatchRepository batchRepository;

    @Autowired
    BatchProcessRepository batchProcessRepository;

    String proceso = null;
    String sistema = null;
    String modulo = null;
    String tipo_info = null;
    String borrar = null;
    Integer secuencia = null;
    String fecha_ini = null;
    String fecha_fin = null;
    String msg = null;
    String status = null;

    public Map<String, Object> batch(Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();

        try {
            get_data(data);
            if (status.equals("OK")) {
                validate_data();
            }
            if (status.equals("OK")) {
                create_data();
            }

        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    private void create_data() {

        try {

            status = "OK";
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
        }

    }

    private void validate_data() {
        try {
            batchRepository.delete_batch(proceso);
            String val_movs = null;
            String val_saldos = null;
            if (!proceso.equals("SICAP004")) {
                val_movs = "M".equals(tipo_info) ? "S" : "N";
                val_saldos = "S".equals(val_movs) ? "N" : "S";
            }
            LocalDate now = LocalDate.now();
            BatchID batchId = BatchID.builder().nom_proceso(proceso).fecha(now).build();
            BatchEntity batchEntity = BatchEntity.builder().id(batchId).par_modulo(modulo).par_sistema(sistema)
                    .par_borrar(borrar).par_fecha_fin(utils.get_date(fecha_fin)).par_movtos(val_movs)
                    .par_saldos(val_saldos).par_fecha_ini(utils.get_date(fecha_ini)).par_orden(secuencia)
                    .par_borrar(borrar).build();
            batchRepository.save(batchEntity);
            status = "OK";
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
        }
    }

    private void get_data(Map<String, Object> data) {
        try {
            status = "OK";
            Set<String> procesos_validos = Set.of("SICAP004", "SICAP002", "SICAP001", "procesotest");
            proceso = (String) data.get("proceso");
            sistema = (String) data.get("sistema");
            modulo = (String) data.get("modulo");
            fecha_ini = (String) data.get("fecha_ini");
            fecha_fin = (String) data.get("fecha_fin");
            tipo_info = (String) data.get("tipo_informacion");
            borrar = (String) data.get("borrar");
            secuencia = (Integer) data.get("secuencia");
            String validate_date = null;
            if (utils.isNullOrEmpty(proceso)) {
                status = "Error";
                msg = "El proceso no puede ser nulo.";
            } else {
                if (!procesos_validos.contains(proceso)) {
                    status = "Error";
                    msg = "El valor del campo proceso no corresponde a un proceso registrado válido.";
                    return;
                }
            }
            if (!proceso.equals("SICAP004")) {
                if (utils.isNullOrZero(secuencia)) {
                    switch (proceso) {
                    case "SICAP002":
                        secuencia = 1;
                        break;
                    default:
                        status = "Error";
                        msg = "La secuencia no debe ser nula o cero.";
                        break;
                    }
                }

                if (utils.isNullOrEmpty(sistema)) {
                    status = "Error";
                    msg = "El sistema no puede ser nulo.";
                    return;
                } else if (utils.isNullOrEmpty(modulo)) {
                    status = "Error";
                    msg = "El modulo no puede ser nulo.";
                    return;
                } else {
                    if (utils.isNullOrEmpty(borrar)) {
                        status = "Error";
                        msg = "La opción borrado no puede ser nulo.";
                        return;
                    } else {
                        String regex1 = "^[SN]$";
                        if (!Pattern.matches(regex1, borrar)) {
                            status = "Error";
                            msg = "Borrar información sólo debe contener un carácter entre 'S' o 'N'.";
                            return;
                        }
                    }

                    if (utils.isNullOrEmpty(tipo_info)) {
                        status = "Error";
                        msg = "El tipo de información no puede ser nulo.";
                        return;
                    } else {
                        String regex = "^[SM]$";
                        if (!Pattern.matches(regex, tipo_info)) {
                            status = "Error";
                            msg = "El tipo de información debe contener sólo 1 carácter entre 'S' o 'M'.";
                            return;
                        }
                    }
                }
            }
            if (utils.isNullOrEmpty(fecha_ini) || utils.isNullOrEmpty(fecha_fin)) {
                status = "Error";
                msg = "Las fechas no pueden ser nulas";
                return;
            } else {
                if (!utils.is_validate_date(fecha_ini) && !utils.is_validate_date(fecha_fin)) {
                    status = "Error";
                    msg = "Formato de fecha incorrecto";
                    return;
                } else {
                    switch (proceso) {
                    case "SICAP002":
                        if (tipo_info.equals("S")) {
                            validate_date = utils.is_validate_date_ini_and_end(fecha_ini, fecha_fin, true);
                            if (validate_date != "OK") {
                                status = "Error";
                                msg = validate_date;
                                return;
                            }
                        }
                        break;
                    default:
                        validate_date = utils.is_validate_date_ini_and_end(fecha_ini, fecha_fin, false);
                        if (validate_date != "OK") {
                            status = "Error";
                            msg = validate_date;
                            return;
                        }
                        break;
                    }
                }
            }

        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }

    }

}
