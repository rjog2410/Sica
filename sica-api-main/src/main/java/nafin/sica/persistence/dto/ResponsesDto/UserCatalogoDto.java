package nafin.sica.persistence.dto.ResponsesDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nafin.sica.persistence.dto.RolDto;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCatalogoDto {
    private Integer id;
    private String username;
    private String nombre;
    private String telefono;
    private String ubicacion;
    private String transferencia;
    private List<RolDto> roles;
    private String rolesString;


}
