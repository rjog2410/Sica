package nafin.sica.persistence.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
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
@Table(name = "sica_formulas")
public class FormulasEntity {
    @EmbeddedId
    FormulasId id;
    @NotBlank
    @Size(max = 1)
    private String for_operador;
}
