package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PantallaMenuDto {
    private Integer id_pantalla;
    private String nombre_pantalla;
    private Integer id_menu;
    private String nombre_menu;
}
