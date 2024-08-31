package nafin.sica.persistence.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Entity
@Table(name = "sica_titulos")
public class ColumnasValidateEntity {
    @Id
    @NotBlank
    private String tit_mod_sis_clave;
    @NotBlank
    private String tit_mod_clave;
    @NotNull
    private Integer tit_columna;
    @NotBlank
    private String tit_descripcion;
}
