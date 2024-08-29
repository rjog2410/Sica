package nafin.sica.persistence.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "sica_menus_usuarios")
public class MenusUsuarioEntity {

    @Id
    @GeneratedValue
    @Column(name = "id_menu_usuario")
    private Integer id;
    private Integer id_menu;
    private Integer id_usuario;

}
