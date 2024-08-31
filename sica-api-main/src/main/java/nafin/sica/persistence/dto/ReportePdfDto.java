package nafin.sica.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class ReportePdfDto {

    private Integer oficina;
    private String nom_oficina;
    private Integer moneda;
    private String nom_moneda;
    private Integer cuenta;
    // private String nom_cuenta;
    private Integer con_importe_sif;
    private Integer con_importe_ao;
    // private Integer diferencia;
}
