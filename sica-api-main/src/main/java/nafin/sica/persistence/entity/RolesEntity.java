package nafin.sica.persistence.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "sica_roles", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_rol", "rol_name" }) })
public class RolesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer id;
    @Size(max = 100)
    @NotBlank
    @Column(name = "rol_name")
    private String nombre;

    @PrePersist
    @PreUpdate
    public void onSave() {
        nombre = nombre.toUpperCase();
    }

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Set<RolesUsuariosEntity> rolesUsuarios;

}
