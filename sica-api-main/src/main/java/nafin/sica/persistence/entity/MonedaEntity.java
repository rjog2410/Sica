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
@Table(name = "sica_monedas")
public class MonedaEntity {
    @Id
    private Integer mon_clave;
    private String mon_nombre;
}
