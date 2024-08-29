package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class CuentasReglaDto {
    private String cuc_sis_clave;
    private String cuc_mod_clave;
    private Integer id;
    private Integer cuenta;
    private String subcta1;
    private String subcta2;
    private String subcta3;
    private String subcta4;
    private String subcta5;
    private String subcta6;
    private String subcta7;
    private Integer tipo_ente;
    private Integer ente;
    private String tipo_de_conciliacion;
}
