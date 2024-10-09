package nafin.sica.persistence.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sica_pantallas_users")
public class UserPantallaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pantalla_user")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "id_pantalla", nullable = false)
    private PantallasEntity pantallaUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference // Agregar esta anotación
    @JoinColumn(name = "id_user", nullable = false)
    private UserEntity userPantalla;

    // Métodos auxiliares para manejar la relación bidireccional
    public void setUsers(UserEntity user) {
        this.userPantalla = user;
    }

    public void setPantallas(PantallasEntity pantallas) {
        this.pantallaUser = pantallas;
    }

}
