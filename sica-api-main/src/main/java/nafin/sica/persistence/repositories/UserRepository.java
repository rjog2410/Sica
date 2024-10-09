package nafin.sica.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {

    Optional<UserEntity> findUserEntityByUsername(String username);

    Optional<UserEntity> findByUsername(String username);

    @Query("select u from UserEntity u where u.id <> ?1 and u.username = ?2")
    Optional<UserEntity> validateUsername(Integer id, String username);

}
