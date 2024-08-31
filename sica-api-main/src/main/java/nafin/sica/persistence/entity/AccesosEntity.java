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
@Table(name = "sica_accesos")
public class AccesosEntity {
    @Id
    private String acc_usu_clave;
    private String acc_mod_sis_clave;
    private String acc_mod_clave;
    private String acc_transferencia;
}
