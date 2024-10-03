package nafin.sica.persistence.dto;

import java.text.DecimalFormat;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConciliacionSaldosDto {

    private String con_mod_sis_clave;
    private String con_mod_clave;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate con_fecha;
    private Integer con_oficina;
    private Integer con_moneda;
    private Integer con_cuenta;
    private String con_scta1;
    private String con_scta2;
    private String con_scta3;
    private String con_scta4;
    private String con_scta5;
    private String con_scta6;
    private String con_scta7;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate con_fecha_carga;
    private Integer con_tipo_ente;
    private Integer con_ente;
    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern =
    // "#,###,###,###,##0.00")
    private Double con_importe_sif;
    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern =
    // "#,###,###,###,##0.00")
    private Double con_importe_ao;
    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern =
    // "#,###,###,###,##0.00")
    private Double con_dif;

    public String getCon_importe_sif() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,##0.00");
        return formato.format(con_importe_sif);
    }

    public String getCon_importe_ao() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,##0.00");
        return formato.format(con_importe_ao);
    }

    public String getCon_dif() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,###,###,##0.00");
        return formato.format(con_dif);
    }

}
