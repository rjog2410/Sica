package nafin.sica.persistence.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModuloReporteDto {
    String clave_sistema;
    String clave_modulo;
    String nombre_modulo;
    LocalDate fecha_carga;
    Integer num_registros;
    LocalDate fecha_informacion;
    String tipo_transaccion;
    String status;
    String agrupacion_reportes;

}
