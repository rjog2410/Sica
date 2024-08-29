package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.MenusEntity;

@Repository
public interface MenusRepository extends CrudRepository<MenusEntity, Integer>{

}
