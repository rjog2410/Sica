package nafin.sica.persistence.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Entity
@Table(name = "sica_pantallas")
public class PantallasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pantalla")
    private Integer id;
    private String nombre;
    @Column(name = "url_pantalla")
    private String url;
    @Column(name = "tipo_pantalla")
    private String tipo;
    private Integer id_menu;

}
