package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PantallaDto {

    private Integer id;
    private String nombre;
    private String urlPantalla;

}
