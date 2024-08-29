package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sica_modulos", uniqueConstraints = {@UniqueConstraint(columnNames = {"mod_clave"})})
public class ModulosEntity {
    @NotBlank
    @Size(max = 10)
    private String mod_sis_clave;
    // private SistemasEntity mod_sis_clave;
    @Id
    @NotBlank
    @Size(max = 10)
    private String mod_clave;
    @NotBlank
    @Size(max = 50)
    private String mod_nombre;
    private Integer mod_registros;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate mod_fecha_carga;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate mod_fecha_info;
    @Size(max = 1)
    @Pattern(regexp = "^[SN]$")
    private String status_trans;
    @Size(max = 1)
    @Pattern(regexp = "^[AS]$")
    private String tipo_trans;
    @Size(max = 1)
    @Pattern(regexp = "^[SN]$")
    private String mod_agrup_rep;

}
