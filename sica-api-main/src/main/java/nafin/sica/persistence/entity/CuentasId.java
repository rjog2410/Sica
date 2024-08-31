package nafin.sica.persistence.entity;

import java.io.Serializable;

import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CuentasId  implements Serializable{
    private Integer cue_mayor;
    private String cue_scta1;
    private String cue_scta2;
    private String cue_scta3;
    private String cue_scta4;
}
