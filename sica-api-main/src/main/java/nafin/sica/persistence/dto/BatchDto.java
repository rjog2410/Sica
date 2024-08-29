package nafin.sica.persistence.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class BatchDto {

    private LocalDate fecha;
    private String nom_proceso;
}
