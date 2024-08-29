package nafin.sica.persistence.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


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
public class CuentasConciliaEntity {
    @Id
    @GeneratedValue
    private Integer cuc_clave;
    @NotBlank
    private String cuc_mod_sis_clave;
    @NotBlank
    private String cuc_mod_clave;
    private Integer cuc_cuenta;
    private String cuc_scta1;
    private String cuc_scta2;
    private String cuc_scta3;
    private String cuc_scta4;
    private String cuc_scta5;
    private String cuc_scta6;
    private String cuc_scta7;
    private Integer cuc_tipo_ente;
    private Integer cuc_ente;
    @Size(max = 1)
    @Pattern(regexp = "^[SN]$")
    private String cuc_consolida_ente;
    @Size(max = 1)
    @Pattern(regexp = "^[SN]$")
    private String cuc_inc_saldo;
    @Size(max = 1)
    @Pattern(regexp = "^[SN]$")
    private String cuc_inc_movs;
}
