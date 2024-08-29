package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "sica_conciliaciones")
public class ConciliacionesEntity {

    @Id
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
    private Integer con_importe_sif;
    private Integer con_importe_ao;

}
