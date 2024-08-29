package nafin.sica.persistence.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.MonedaEntity;

@Repository
public interface MonedaRepository extends CrudRepository<MonedaEntity,Integer> {

}
