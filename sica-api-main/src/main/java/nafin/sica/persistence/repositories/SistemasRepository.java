package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.SistemDto;
import nafin.sica.persistence.entity.SistemasEntity;

@Repository
public interface SistemasRepository extends CrudRepository<SistemasEntity, String> {

    @Query("select new nafin.sica.persistence.dto.SistemDto(s.sis_clave,s.sis_nombre) from SistemasEntity s where s.sis_clave = ?1")
    Optional<SistemDto> getBySis_Clave(String sis_clave);

    @Query("select s.sis_clave from SistemasEntity s where s.sis_clave = ?1")
    Optional<SistemasEntity> findBySis_claveOnlyName(String sis_clave);

    // @Query("select u.sis_clave as sis_clave, u.sis_nombre as sis_nombre from
    // SistemasEntity u")
    // Iterable<SistemasEntity> findAllBySisClaveOnlyName();
    @Query("select new nafin.sica.persistence.dto.SistemDto(e.sis_clave,e.sis_nombre) from SistemasEntity e")
    List<SistemDto> findAllBySisClaveOnlyName();
}
