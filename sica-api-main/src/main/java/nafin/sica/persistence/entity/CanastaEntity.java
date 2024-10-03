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

@Data
@Builder
@AllArgsConstructor
@Entity
@Table(name = "sica_canasta")
public class CanastaEntity {
    @Id
    private String can_mod_sis_clave;
    private String can_mod_clave;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha_carga;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate can_fecha;
    private String can_tipo_salmov;
    private String can_estatus;
    private String can_c1;
    private String can_c2;
    private String can_c3;
    private String can_c4;
    private String can_c5;
    private String can_c6;
    private String can_c7;
    private String can_c8;
    private String can_c10;
    private String can_c11;
    private String can_c12;
    private String can_c13;
    private String can_c14;
    private String can_c15;
    private String can_c16;
    private String can_c17;
    private String can_c18;
    private String can_c19;
    private String can_c20;
    private String can_c21;
    private String can_c22;
    private String can_c23;
    private String can_c24;
    private String can_c25;
    private String can_c26;
    private String can_c27;
    private String can_c28;
    private String can_c29;
    private String can_c30;
    private String can_c31;
    private String can_c32;
    private String can_c33;
    private String can_c34;
    private String can_c35;
}
