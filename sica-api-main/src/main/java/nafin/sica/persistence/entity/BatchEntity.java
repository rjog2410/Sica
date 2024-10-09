package nafin.sica.persistence.entity;

import java.time.LocalDate;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "sica_batch")
public class BatchEntity {

    @EmbeddedId
    BatchID id;
    // @NotBlank(message = "La fecha no debe ser nulo")
    // private LocalDate fecha;
    // @Id
    // @NotBlank(message = "El proceso no puede ser nulo")
    // private String nom_proceso;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate par_fecha_ini;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate par_fecha_fin;
    private String par_sistema;
    private String par_modulo;
    private String par_saldos;
    private String par_movtos;
    private String par_borrar;
    private String procesado;
    private Integer par_orden;
    private String par_proceso;

}
