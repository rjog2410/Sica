package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.PantallasEntity;

@Repository
public interface PantallaRepository extends CrudRepository<PantallasEntity,Integer> {



}
