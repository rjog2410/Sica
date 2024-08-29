package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ColumnasDto {
    Integer num_columnas;
    String titulo;
    String mod_sis_clave;
    String mod_clave;
}
