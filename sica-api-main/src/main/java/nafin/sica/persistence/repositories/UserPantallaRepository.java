package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.UserPantallaEntity;

@Repository
public interface UserPantallaRepository extends CrudRepository<UserPantallaEntity, Integer> {

}
