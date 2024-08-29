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
public class FormulasId implements Serializable{
    @NotNull
    private Integer for_cuc_clave;
    @NotBlank
    private String for_tit_mod_sis_clave;
    @NotBlank
    private String for_tit_mod_clave;
    @NotNull
    private Integer for_tit_columna;
    @NotNull
    private Integer for_secuencia;
 
}
