package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.RolPantallaEntity;

@Repository
public interface RolPantallaRepository extends CrudRepository<RolPantallaEntity, Long> {

}
