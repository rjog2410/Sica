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
@Table(name = "sica_conciliaciones_movs")
public class ConciliacionesMovsEntity {
    @Id
    private String com_mod_sis_clave;
    private String com_mod_clave;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate com_fecha;
    private Integer com_oficina;
    private Integer com_moneda;
    private Integer com_cuenta;
    private String com_scta1;
    private String com_scta2;
    private String com_scta3;
    private String com_scta4;
    private String com_scta5;
    private String com_scta6;
    private String com_scta7;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate com_fecha_carga;
    private Integer com_tipo_ente;
    private Integer com_ente;
    private Integer com_importe_sif;
    private Integer com_importe_ao;
}
