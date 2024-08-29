package nafin.sica.persistence.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
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
@Table(name = "sica_reglas")
public class ReglasEntity {

    @EmbeddedId
    @NotNull
    ReglasId id;
    @NotBlank
    @Size(max = 10)
    private String reg_operador;
    @NotBlank
    @Size(max = 2)
    private String reg_valor;
}
