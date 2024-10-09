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
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "sica_users", uniqueConstraints = { @UniqueConstraint(columnNames = { "usu_clave" }) })
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    Integer id;
    @NotBlank
    @Column(name = "usu_clave")
    @Size(max = 20)
    String username;
    @Column(name = "usu_nombre")
    @Size(max = 40)
    String nombre;
    @Size(max = 10)
    @Column(name = "usu_telefono")
    String telefono;
    @Column(name = "usu_ubicacion")
    @Size(max = 30)
    String ubicacion;
    @Column(name = "usu_transferencia")
    @Size(max = 1)
    String transferencia;

    @PrePersist
    @PreUpdate
    public void onSave() {
        nombre = nombre.toUpperCase();
        username = username.toUpperCase();
    }

    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Agregar esta anotación para evitar referencias circulares en la serialización JSON
    @Builder.Default // Agregar esta línea
    private Set<RolesUsersEntity> rolUsers = new HashSet<>();

    @OneToMany(mappedBy = "userPantalla", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Agregar esta anotación para evitar referencias circulares en la serialización JSON
    @Builder.Default // Agregar esta línea
    private Set<UserPantallaEntity> UserPantalla = new HashSet<>();

    // Relación con SesionEntity
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Para evitar referencia circular
    @Builder.Default
    private Set<SesionEntity> sesiones = new HashSet<>();


    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    // @JsonManagedReference // Agregar esta anotación para evitar referencias circulares en la serialización JSON
    // @Builder.Default
    // private Set<SesionEntity> sesiones = new HashSet<>();

}
