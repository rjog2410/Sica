package nafin.sica.persistence.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Entity
@Table(name = "sica_entes")
public class EntesEntity {
    @Id
    private Integer ent_clave;
    private Integer tpe_clave;
    private String ent_numero;
    private String ofi_tipo;
    private String ent_nombre;
    private String ent_rfc;
    private String ent_codigo_postal;
    private String ent_direccion;
    private String ent_ind_honorarios;
    private String ent_vigencia;
    private String ent_ind_medicos;
    private String ent_riesgos;
    private String ent_descontador;
    private String ent_traspaso;
    private String ent_curp;
    private Integer act_clave;
    private Integer ent_ent_clave;
    private Integer ent_cuenta_cheque;
    private Integer loc_clavInteger;
    private Integer sec_clave;
    private Integer ent_registro_hacienda;
    private Integer mon_clave;
    private Integer int_clave;

}
