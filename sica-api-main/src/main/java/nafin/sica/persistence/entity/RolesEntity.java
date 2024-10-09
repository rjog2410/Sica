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
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "sica_roles", uniqueConstraints = { @UniqueConstraint(columnNames = { "rol_name", "id_rol" }) })
public class RolesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer id;
    @Size(max = 100)
    @NotBlank
    @Column(name = "rol_name", unique = true, nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "roles", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Agregar esta anotación
    @Builder.Default // Agregar esta línea
    private Set<RolPantallaEntity> rolPantalla = new HashSet<>();

    @OneToMany(mappedBy = "rolUser", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Agregar esta anotación
    @Builder.Default // Agregar esta línea
    private Set<RolesUsersEntity> rolUser = new HashSet<>();

    @PrePersist
    @PreUpdate
    public void onSave() {
        nombre = nombre.toUpperCase();
    }

    public void addRolPantalla(RolPantallaEntity rolPantallaEntity) {
        rolPantalla.add(rolPantallaEntity);
        rolPantallaEntity.setRoles(this);
    }

    public void removeRolPantalla(RolPantallaEntity rolPantallaEntity) {
        rolPantalla.remove(rolPantallaEntity);
        rolPantallaEntity.setRoles(null);
    }

}
