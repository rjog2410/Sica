package nafin.sica.persistence.dto.ResponsesDto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nafin.sica.persistence.dto.PantallaDto;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RolResponseDto {
    private Integer id;
    private String nombre;
    private List<PantallaDto> Pantallas;
}
