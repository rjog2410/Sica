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
public class MenuRequestDto {

    private Integer id;
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;
    @NotNull(message = "El orden no debe ser nulo")
    private Integer orden;
    @NotBlank(message = "El tipo no debe ser nulo")
    @Size(max = 1)
    private String tipo;
    @NotBlank(message = "El campo url es obligatorio")
    @Size(max = 100)
    private String url;

}
