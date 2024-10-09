package nafin.sica.persistence.dto.ValidationsDto;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuRequestDeleteAllDto {

    @NotEmpty(message = "Debe tener al menos 1 id válido.")
    private List<Integer> Ids;

}
