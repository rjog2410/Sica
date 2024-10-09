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

    // Constructor alternativo para calcular la diferencia
    public ConciliacionSaldosDto(String con_mod_sis_clave, String con_mod_clave, LocalDate con_fecha,
            Integer con_oficina, Integer con_moneda, Integer con_cuenta, String con_scta1, String con_scta2,
            String con_scta3, String con_scta4, String con_scta5, String con_scta6, String con_scta7,
            LocalDate con_fecha_carga, Integer con_tipo_ente, Integer con_ente, Double con_importe_sif,
            Double con_importe_ao) {
        this.con_mod_sis_clave = con_mod_sis_clave;
        this.con_mod_clave = con_mod_clave;
        this.con_fecha = con_fecha;
        this.con_oficina = con_oficina;
        this.con_moneda = con_moneda;
        this.con_cuenta = con_cuenta;
        this.con_scta1 = con_scta1;
        this.con_scta2 = con_scta2;
        this.con_scta3 = con_scta3;
        this.con_scta4 = con_scta4;
        this.con_scta5 = con_scta5;
        this.con_scta6 = con_scta6;
        this.con_scta7 = con_scta7;
        this.con_fecha_carga = con_fecha_carga;
        this.con_tipo_ente = con_tipo_ente;
        this.con_ente = con_ente;
        this.con_importe_sif = con_importe_sif;
        this.con_importe_ao = con_importe_ao;
        this.con_dif = con_importe_sif - con_importe_ao;
    }

    public String getCon_importe_sif() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,###,##0.00;-#,###,###,###,###,##0.00");
        return formato.format(con_importe_sif);
    }
    
    public String getCon_importe_ao() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,###,##0.00;-#,###,###,###,###,##0.00");
        return formato.format(con_importe_ao);
    }
    
    public String getCon_dif() {
        DecimalFormat formato = new DecimalFormat("#,###,###,###,###,###,###,##0.00;-#,###,###,###,###,###,###,##0.00");
        return formato.format(con_dif);
    }

}
