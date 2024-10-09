package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.RolesUsersEntity;

@Repository
public interface RolesUsersRepository extends CrudRepository<RolesUsersEntity,Integer> {

}
