package nafin.sica.persistence.repositories;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.RolesEntity;

@Repository
public interface RoleRepository extends CrudRepository<RolesEntity,Integer>{

}
