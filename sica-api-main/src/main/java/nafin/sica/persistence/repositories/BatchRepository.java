package nafin.sica.persistence.repositories;

import java.time.LocalDate;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.BatchEntity;
import nafin.sica.persistence.entity.BatchID;

@Repository
public interface BatchRepository extends CrudRepository<BatchEntity, BatchID>{

    @Query("select b from BatchEntity b where b.procesado = 'S' and b.id.nom_proceso = ?1")
    Optional<BatchEntity> get_Batch(String proceso);

    @Query("select b from BatchEntity b where b.id.nom_proceso = ?1 and b.procesado is null and b.id.fecha = ?2")
    Optional<BatchEntity> validate_batch(String proceso, LocalDate fecha);

    @Modifying
    @Transactional
    @Query("delete from BatchEntity b where b.procesado = 'S' and b.id.nom_proceso = ?1")
    void delete_batch(String proceso);
    
}
