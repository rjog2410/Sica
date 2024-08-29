package nafin.sica.persistence.repositories;

import java.time.LocalDateTime;
import java.util.Optional;



import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import nafin.sica.persistence.entity.SesionEntity;

@Repository

public interface SesionRepository extends CrudRepository <SesionEntity,Long> {

    @Query("select u from SesionEntity u where u.id = ?1 and u.date_logout = null and u.date_login < sysdate - 30/(24*60)")
    Optional<SesionEntity> validateSesion(Long id);

    @Modifying
    @Transactional
    @Query(value = "update sica_sesiones set date_logout = ?1 where date_login < ?2 and date_logout is null", nativeQuery = true)
    Integer closeSesion(LocalDateTime date_logout, LocalDateTime date_login);


    @Query("select u from SesionEntity u where u.id = ?1")
    Optional<SesionEntity> getInfoUser(Long id);

   


    
}
