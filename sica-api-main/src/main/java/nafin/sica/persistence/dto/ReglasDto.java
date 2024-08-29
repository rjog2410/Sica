package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReglasDto {
    private Integer reg_cuc_clave;
    private String reg_tit_mod_sis_clave;
    private String reg_tit_mod_clave;
    private Integer reg_tit_columna;
    private Integer reg_secuencia;
    private String reg_operador;
    private String reg_valor;
}
