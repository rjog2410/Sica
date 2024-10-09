package nafin.sica.persistence.dto.ValidationsDto;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestUserDto {
    private Integer id;
    @NotBlank(message = "El nombre de usuario no debe ser nulo")
    @Size(max = 40)
    private String nombre;
    @NotBlank(message = "El username no debe ser nulo")
    @Size(max = 20, message = "El tamaño máximo del username es de 20 carácteres")
    private String username;
    @Size(max = 10)
    private String telefono;
    @Size(max = 30, message = "La ubicación debe tener como máximo 30 carácteres")
    private String ubicacion;
    @Size(max = 6, message = "El tamaño maximo debe ser de 6 carácteres")
    private String transferencia;
    @NotNull(message = "Debe agregar al menos un rol")
    List<Integer> rolesIds;

}
