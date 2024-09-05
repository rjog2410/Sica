package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FormulasDto {
    private Integer for_cuc_clave;
    private String for_tit_mod_sis_clave;
    private String for_tit_mod_clave;
    private Integer for_tit_columna;
    private Integer for_secuencia;
    private String for_operador;
}
