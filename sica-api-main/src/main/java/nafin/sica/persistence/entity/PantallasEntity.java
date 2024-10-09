package nafin.sica.persistence.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sica_pantallas")
public class PantallasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pantalla")
    private Integer id;
    private String nombre;
    @Column(name = "url_pantalla", unique = true)
    private String url;
    @Column(name = "tipo_pantalla")
    private String tipo;
    private String informacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_menu", nullable = true) // Apuntará al id del menú
    private MenusEntity menu;

    @OneToMany(mappedBy = "pantallas", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // Agregar esta línea
    @JsonManagedReference // Agregar esta anotación
    private Set<RolPantallaEntity> rolPantallas = new HashSet<>();

    @OneToMany(mappedBy = "pantallaUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // Agregar esta línea
    @JsonManagedReference // Agregar esta anotación
    private Set<UserPantallaEntity> userPantalla = new HashSet<>();

    public void addRolPantalla(RolPantallaEntity rolPantallaEntity) {
        rolPantallas.add(rolPantallaEntity);
        rolPantallaEntity.setPantallas(this);
    }

    public void removeRolPantalla(RolPantallaEntity rolPantallaEntity) {
        rolPantallas.remove(rolPantallaEntity);
        rolPantallaEntity.setPantallas(null);
    }

    public void addUserPantalla(UserPantallaEntity userPantallaEntity) {
        userPantalla.add(userPantallaEntity);
        userPantallaEntity.setPantallaUser(this);
    }

    public void removeUserPantalla(UserPantallaEntity userPantallaEntity) {
        userPantalla.remove(userPantallaEntity);
        userPantallaEntity.setPantallaUser(null);
    }

}
