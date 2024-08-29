package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.RolesUsuariosEntity;

@Repository
public interface RolesUsuariosRepository extends CrudRepository<RolesUsuariosEntity,Integer> {

}
