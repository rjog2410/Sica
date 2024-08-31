package nafin.sica.persistence.entity;

import java.io.Serializable;

import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class ColumnasId implements Serializable{
    private String tit_mod_sis_clave;
    private String tit_mod_clave;
    private Integer tit_columna;

}
