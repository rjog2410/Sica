package nafin.sica.persistence.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "sica_v_oficinas")
public class OficinasEntity {
    @Id
    Integer clave_particular;
    String nombre;

}
