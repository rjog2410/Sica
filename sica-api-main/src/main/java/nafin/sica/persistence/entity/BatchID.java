package nafin.sica.persistence.entity;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class BatchID  implements Serializable{

    private LocalDate fecha;
    private String nom_proceso;
}
