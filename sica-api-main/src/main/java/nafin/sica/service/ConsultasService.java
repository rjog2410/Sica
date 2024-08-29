package nafin.sica.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ConciliacionSaldosDto;
import nafin.sica.persistence.repositories.ConciliacionesRepository;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class ConsultasService {
    @Autowired
    ConciliacionesRepository conciliacionesRepository;

    String sistema = null;
    String modulo = null;
    String fecha = null;
    Integer moneda = null;
    Integer oficina = null;
    String status = null;
    String msg = null;
    LocalDate fecha_carga = null;

    public Map<String, Object> get_conciliacion_saldos(Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data_validate = new HashMap<>();
        try {
            get_data(data);
            if (status == "OK") {
                data_validate = get_data_validated();
                if (status == "OK") {
                    response.put("data", data_validate.get("data"));
                }
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    private Map<String, Object> get_data_validated() {
        Map<String, Object> response = new HashMap<>();
        List<ConciliacionSaldosDto> lista = null;
        try {
            if (moneda != null && oficina != null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_all(sistema, modulo, fecha_carga, oficina, moneda);
            } else if (moneda != null && oficina != null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_moneda_and_oficina(sistema, modulo,
                        moneda, oficina);
            } else if (moneda != null && oficina == null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha_and_moneda(sistema, modulo,
                        fecha_carga, moneda);
            } else if (moneda == null && oficina != null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha_and_oficina(sistema, modulo,
                        fecha_carga, oficina);
            } else if (moneda != null && oficina == null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_moneda(sistema, modulo, moneda);
            } else if (moneda == null && oficina != null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_oficina(sistema, modulo, oficina);
            } else if (moneda == null && oficina == null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha(sistema, modulo, fecha_carga);
            } else {
                lista = conciliacionesRepository.get_by_sistema_and_modulo(sistema, modulo);
            }
            response.put("data", lista);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    public void get_data(Map<String, Object> data) {
        try {
            status = "OK";
            sistema = (String) data.get("sistema");
            if (sistema == null || sistema.equals("")) {
                status = "Error";
                msg = "El sistema no puede ser nulo.";
            }
            modulo = (String) data.get("modulo");
            if (modulo == null || modulo.equals("")) {
                status = "Error";
                msg = "El modulo no puede ser nulo.";
            }
            fecha = (String) data.get("fecha_informacion");
            if (fecha != null && !fecha.equals("")) {
                if (!is_validate_date(fecha)) {
                    status = "Error";
                    msg = "Formato de fecha incorrecto";
                }
            }
            moneda = (Integer) data.get("moneda");
            if (moneda != null && moneda == 0) {
                status = "Error";
                msg = "La moneda no puede ser cero.";
            }
            oficina = (Integer) data.get("oficina");
            if (oficina != null && oficina == 0) {
                status = "Error";
                msg = "La oficina no puede ser cero.";
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
    }

    private boolean is_validate_date(String fecha) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            fecha_carga = LocalDate.parse(fecha, formatter);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

}
