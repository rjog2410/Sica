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
public class DeleteAllDto {
    @NotEmpty(message = "Debe enviarse al menos un id")
    private List<Integer> Ids;
}
