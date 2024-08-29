package nafin.sica.utils;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    List<String> errors;

}
