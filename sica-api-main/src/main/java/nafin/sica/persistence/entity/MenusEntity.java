package nafin.sica.persistence.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sica_menus", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_menu", "url_menu" }) })
public class MenusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_menu")
    private Integer id;
    @NotBlank
    @Size(max = 100)
    @Column(name = "nombre_menu")
    private String nombre;
    @NotNull(message = "El orden no debe ser nulo")
    @Column(name = "orden_menu")
    private Integer orden;
    @NotBlank(message = "El tipo no debe ser nulo")
    @Column(name = "tipo_menu")
    @Size(max = 1)
    private String tipo;
    private Integer id_menu_padre;
    @Column(name = "url_menu")
    @Size(max = 100)
    @NotBlank(message = "El campo url es obligatorio")
    private String url;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PantallasEntity> pantallas = new HashSet<>();

    // @PrePersist
    // public void onSave() {
    // id_menu_padre = id_menu_padre != null ? id_menu_padre : 0;
    // }

}
