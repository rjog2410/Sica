package nafin.sica.persistence.entity;

import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReglasId implements Serializable {
    @NotNull
    private Integer reg_cuc_clave;
    @NotBlank
    private String reg_tit_mod_sis_clave;
    @NotBlank
    private String reg_tit_mod_clave;
    @NotNull
    private Integer reg_tit_columna;
    @NotNull
    private Integer reg_secuencia;
}
