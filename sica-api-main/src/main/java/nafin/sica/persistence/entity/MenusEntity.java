package nafin.sica.persistence.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Entity
@Table(name = "sica_menus", uniqueConstraints = { @UniqueConstraint(columnNames = { "nombre_menu", "id_menu", "url_menu" }) })
public class MenusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_menu")
    private Integer id;
    @NotBlank
    @Size(max = 100)
    @Column(name = "nombre_menu")
    private String nombre;
    @NotNull
    @Column(name = "orden_menu")
    private Integer orden;
    @NotBlank
    @Column(name = "tipo_menu")
    @Size(max = 1)
    private String tipo;
    private Integer id_menu_padre;
    @Column(name = "url_menu")
    @Size(max = 100)
    @NotBlank
    private String url;
}
