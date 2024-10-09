package nafin.sica.persistence.dto.ValidationsDto;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuRequestDeleteDto {
    @NotNull(message = "El id no debe ser nulo")
    private Integer id;
}
