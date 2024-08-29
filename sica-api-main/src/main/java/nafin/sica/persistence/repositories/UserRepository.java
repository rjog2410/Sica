package nafin.sica.persistence.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {

    Optional<UserEntity> findUserEntityByUsername(String username);

}
