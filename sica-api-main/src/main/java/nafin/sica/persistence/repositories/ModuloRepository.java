package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import nafin.sica.persistence.dto.ModuloReporteDto;
import nafin.sica.persistence.dto.ModulosCatalogosDto;
import nafin.sica.persistence.dto.SistemFilterDto;
import nafin.sica.persistence.entity.ModulosEntity;

@Repository
public interface ModuloRepository extends CrudRepository<ModulosEntity, String> {

    @Modifying
    @Transactional
    @Query("delete from ModulosEntity where mod_sis_clave = ?1")
    void deleteByMod_sis_clave(String mod_sis_clave);

    @Query("select m from ModulosEntity m where mod_clave = ?1")
    Optional<ModulosEntity> getModulo_by_clave(String clave);

    @Query("select new nafin.sica.persistence.dto.ModulosCatalogosDto(m.mod_clave) from ModulosEntity m where m.mod_sis_clave = ?1")
    List<ModulosCatalogosDto> getModule(String mod_sis_clave);

    @Transactional(readOnly = true)
    @Query("select new nafin.sica.persistence.dto.ModuloReporteDto(m.mod_sis_clave ,m.mod_clave, m.mod_nombre, m.mod_fecha_carga,m.mod_registros, m.mod_fecha_info,m.tipo_trans,m.status_trans, m.mod_agrup_rep) from ModulosEntity m")
    List<ModuloReporteDto> get_all_modules();

        @Query("select new nafin.sica.persistence.dto.SistemFilterDto(c.mod_sis_clave) from ModulosEntity c group by c.mod_sis_clave order by c.mod_sis_clave")
    List<SistemFilterDto> getSistemFilter();


}
