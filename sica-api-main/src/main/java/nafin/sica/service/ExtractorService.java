package nafin.sica.service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExtractorService {

    @Autowired
    Utils utils;

    public Map<String, Object> validate_data(Map<String, Object> data, String origin) {
        Map<String, Object> response = new HashMap<>();
        String msg = null;
        String status = "OK";
        try {
            String sistema = (String) data.get("sistema");
            String modulo = (String) data.get("modulo");
            String fecha_inicial = (String) data.get("fecha_inicial");
            String fecha_final = (String) data.get("fecha_final");
            String tipo_info = (String) data.get("tipo_informacion");
            String borrar_info = (String) data.get("borrar_info");

            if (utils.isNullOrEmpty(sistema)) {
                status = "Error";
                msg = "El campo sistema no puede ir vacio";
            } else if (utils.isNullOrEmpty(modulo)) {
                status = "Error";
                msg = "El campo modulo no puede ir vacio";
            } else if (utils.isNullOrEmpty(fecha_inicial)) {
                status = "Error";
                msg = "El campo fecha_inicial no puede ir vacio";
            } else if (utils.isNullOrEmpty(fecha_final)) {
                status = "Error";
                msg = "El campo fecha_final no puede ir vacio";
            } else if (utils.isNullOrEmpty(tipo_info)) {
                status = "Error";
                msg = "El campo tipo_informacion no puede ir vacio";
            }

            if (origin.equals("extractor")) {
                if (utils.isNullOrEmpty(borrar_info)) {
                    status = "Error";
                    msg = "El campo borrar_info no puede ir vacio";
                }
            }

            if (status.equals("OK")) {
                String regex = "^[SM]$";
                if (!Pattern.matches(regex, tipo_info)) {
                    status = "Error";
                    msg = "El tipo de información debe contener sólo 1 carácter entre 'S' o 'M'.";
                }
                if (status.equals("OK")) {
                    String validate_date = null;
                    switch (origin) {
                    case "extractor":
                        validate_date = utils.is_validate_date_ini_and_end(fecha_inicial, fecha_inicial, true);
                        if (!validate_date.equals("OK")) {
                            status = "Error";
                            msg = validate_date;
                        }
                        break;
                    default:
                        validate_date = utils.is_validate_date_ini_and_end(fecha_inicial, fecha_final, false);
                        if (!validate_date.equals("OK")) {
                            status = "Error";
                            msg = validate_date;
                        }
                        break;
                    }
                }
            }
            response.put("status", status);
            response.put("message", msg);
        } catch (Exception e) {
            System.out.println(e);
            msg = e.getMessage();
            status = "ErrorCatch";

        }
        return response;
    }

}
