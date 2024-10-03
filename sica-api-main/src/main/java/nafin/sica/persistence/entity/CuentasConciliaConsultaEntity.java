package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
@Table(name = "sica_cuentas_concilia")
public class CuentasConciliaConsultaEntity {
    @Id
    private String cuc_mod_sis_clave;
    @NotBlank
    private String cuc_mod_clave;
    @NotNull
    private Integer cuc_cuenta;
    @NotBlank
    private String cuc_scta1;
    @NotBlank
    private String cuc_scta2;
    @NotBlank
    private String cuc_scta3;
    @NotBlank
    private String cuc_scta4;
    @NotNull
    private Integer cuc_tipo_ente;
    @NotNull
    private Integer cuc_ente;
    @NotNull
    private Integer oficina;
    @NotNull
    private Integer moneda;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate con_fecha;
}
