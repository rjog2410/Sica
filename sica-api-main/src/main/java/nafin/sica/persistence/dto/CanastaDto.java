package nafin.sica.persistence.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CanastaDto {
    private String can_mod_sis_clave;
    private String can_mod_clave;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha_carga;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha_operativa;
    private String can_tipo_salmov;
    private Integer can_reg_cargados;
    private Integer can_reg_conciliacion;
}
