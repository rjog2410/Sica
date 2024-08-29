package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.OficinasEntity;

@Repository
public interface OficinasRepository extends CrudRepository<OficinasEntity,Integer>{

}
