package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.MenusUsuarioEntity;

@Repository
public interface MenusUsuariosRepository extends CrudRepository<MenusUsuarioEntity, Integer> {

}
