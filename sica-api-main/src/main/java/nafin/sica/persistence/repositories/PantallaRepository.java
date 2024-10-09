package nafin.sica.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.PantallasEntity;

@Repository
public interface PantallaRepository extends CrudRepository<PantallasEntity,Integer> {

    @Query("select p from PantallasEntity p where p.url = ?1")
    Optional<PantallasEntity> validarUrl(String url);

    @Query("select p from PantallasEntity p where p.url = ?1 and p.id <> ?2")
    Optional<PantallasEntity> validarUrlUpdate(String url, Integer id);

}
