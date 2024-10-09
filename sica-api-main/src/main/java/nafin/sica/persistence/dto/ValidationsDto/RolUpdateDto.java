package nafin.sica.persistence.dto.ValidationsDto;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RolUpdateDto {
    @NotNull(message = "El id no debe ser nulo")
    private Integer id;
    @Size(max = 100, min = 5, message = "El nombre debe tener entre 5 y 10 carácteres")
    private String nombre;
    @NotEmpty(message = "Debe agregar al menos una pantalla")
    private List<Integer> pantallasIds;
}
