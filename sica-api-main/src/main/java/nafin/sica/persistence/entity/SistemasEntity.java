package nafin.sica.persistence.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "sica_sistemas", uniqueConstraints = { @UniqueConstraint(columnNames = { "sis_clave" }) })
public class SistemasEntity {
    @Id
    @NotBlank
    @Size(max = 10)
    private String sis_clave;
    @NotBlank
    private String sis_nombre;
    private String sis_prefijo;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime sis_fecha_inicio;
    private Integer sis_registros;

    // @OneToMany(fetch = FetchType.LAZY)
    // @JoinColumn(name = "mod_sis_clave")
    // private Set<ModulosEntity> modulos;

}
