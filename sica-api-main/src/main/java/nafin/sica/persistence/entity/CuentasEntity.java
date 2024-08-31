package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sica_cuentas")
public class CuentasEntity {

    // @EmbeddedId
    // CuentasId id;
    @Id
    private Integer cue_mayor;
    private String cue_scta1;
    private String cue_scta2;
    private String cue_scta3;
    private String cue_scta4;
    private String cue_scta5;
    private String cue_scta6;
    private String cue_scta7;
    private String cue_nombre;
    private Integer clc_clave;
    private String tng_clave;
    private Integer ent_clave;
    private String tmo_clave;
    private String ind_dependencia;
    private String cue_vigencia;
    private String cue_ind_ente;
    private String cue_ind_afectable;
    private Integer cnb_mayor;
    private String cnb_scta1;
    private String cnb_scta2;
    private String cnb_scta3;
    private String cnb_scta4;
    private String ind_pas_act;
    private String ind_deu_ac;
    private String ind_componente;
    private Integer cap_clave;
    private Integer scp_clave;
    private Integer cue_rel_bal;
    private String ind_cerorizacion;
    private LocalDate cue_fecha_vig_inicial;
    private LocalDate cue_fecha_vi;

  



}
