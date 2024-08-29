package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponse {
    Integer status;
    String message;
}
