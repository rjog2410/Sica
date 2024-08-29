package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Entity
@Table(name = "sica_canasta")
public class CanastaEntity {
    @Id
    private String can_mod_sis_clave;
    private String can_mod_clave;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha_carga;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha;
    private String can_tipo_salmov;
    private String can_estatus;
}
