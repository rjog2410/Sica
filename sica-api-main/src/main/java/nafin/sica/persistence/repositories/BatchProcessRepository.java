package nafin.sica.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.BatchID;
import nafin.sica.persistence.entity.BatchProcessEntity;

@Repository
public interface BatchProcessRepository extends CrudRepository<BatchProcessEntity, BatchID>{

    @Query("select b from BatchProcessEntity b where b.procesado = 'S'")
    Optional<BatchProcessEntity> get_data_batch();

}
