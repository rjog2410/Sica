package nafin.sica.persistence.dto.ValidationsDto;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserPantallaDto {

    @NotNull(message = "El id del usuario no debe ser nulo")
    private Integer id_user;
    @NotEmpty(message = "Debe agregarse al menos una pantalla")
    private List<Integer> pantallas;

}
