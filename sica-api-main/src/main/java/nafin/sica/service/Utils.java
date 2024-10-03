package nafin.sica.service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class Utils {

    public boolean is_validate_date(String fecha) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            @SuppressWarnings("unused")
            LocalDate fecha_carga = LocalDate.parse(fecha.replace("-", "/"), formatter);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public String is_validate_date_ini_and_end(String fecha_ini, String fecha_fin, boolean validate_day) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate date_inicial = LocalDate.parse(fecha_ini.replace("-", "/"), formatter);
        LocalDate date_final = LocalDate.parse(fecha_fin.replace("-", "/"), formatter);
        Integer dia = date_inicial.getDayOfMonth();
        if (validate_day) {
            if (dia != 1) {
                return "La fecha inicial debe ser el primer día del mes";
            }
        }
        if (date_inicial.isAfter(date_final)) {
            // La Fecha inicial no debe ser mayor a la fecha final
            return "La Fecha inicial no debe ser mayor a la fecha final";
        }

        return "OK";
    }

    public LocalDate get_date(String fecha) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate date_inicial = LocalDate.parse(fecha.replace("-", "/"), formatter);
            return date_inicial;
        } catch (Exception e) {
            return null;
        }

    }


    public boolean isNullOrEmpty(String value) {
        try {
            if (value == null || value.equals("")) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isNullOrZero(Integer value) {
        try {
            if (value == null || value == 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public String format_moneda(Double value) {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,##0.00");
        return formato.format(value);
    }

    public String fecha_actual() {
        LocalDate fecha_proceso_date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return fecha_proceso_date.format(formatter);
    }

    public String hora_actual() {
        LocalTime hora_proceso_time = LocalTime.now();
        DateTimeFormatter formatter_time = DateTimeFormatter.ofPattern("hh:mm:ss");
        return hora_proceso_time.format(formatter_time);
    }

}
