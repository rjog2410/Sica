package nafin.sica.persistence.entity;

import java.util.List;

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
@Table(name = "sica_usuarios", uniqueConstraints = { @UniqueConstraint(columnNames = { "usu_clave" }) })
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    Integer id;
    @NotBlank
    @Column(name = "usu_clave")
    @NotBlank
    @Size(max = 20)
    String username;
    @NotBlank
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

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private List<RolesUsuariosEntity> rolesUsuarios;


}
