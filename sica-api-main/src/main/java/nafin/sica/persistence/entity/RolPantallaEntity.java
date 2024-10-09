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

// @Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sica_rol_pantalla")
public class RolPantallaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_pantalla")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    @JoinColumn(name = "id_pantalla", nullable = false)
    private PantallasEntity pantallas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference // Agregar esta anotación
    @JoinColumn(name = "id_rol", nullable = false)
    private RolesEntity roles;

    // Métodos auxiliares para manejar la relación bidireccional
    public void setRoles(RolesEntity roles) {
        this.roles = roles;
    }

    public void setPantallas(PantallasEntity pantallas) {
        this.pantallas = pantallas;
    }

}
