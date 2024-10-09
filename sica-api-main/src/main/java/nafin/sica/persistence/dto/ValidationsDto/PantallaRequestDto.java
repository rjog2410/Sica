package nafin.sica.persistence.dto.ValidationsDto;

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
public class PantallaRequestDto {

    private Integer id;
    @NotBlank(message = "El nombre no debe ser nulo")
    private String nombre;
    @Size(max = 1)
    private String tipo;
    @NotBlank(message = "El url no debe ser nulo")
    private String url;
    private String informacion;
    @NotNull(message = "El id del menu no debe ser nulo")
    private Integer id_menu;


}
