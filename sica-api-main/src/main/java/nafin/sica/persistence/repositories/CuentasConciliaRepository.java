package nafin.sica.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.CuentasReglaDto;
import nafin.sica.persistence.dto.ModulesFilterDto;
import nafin.sica.persistence.dto.SistemFilterDto;
import nafin.sica.persistence.entity.CuentasConciliaEntity;

@Repository
public interface CuentasConciliaRepository extends CrudRepository<CuentasConciliaEntity, Integer> {

    @Query("select new nafin.sica.persistence.dto.CuentasReglaDto(c.cuc_mod_sis_clave, c.cuc_mod_clave, c.cuc_clave, c.cuc_cuenta, c.cuc_scta1, c.cuc_scta2, c.cuc_scta3, c.cuc_scta4, c.cuc_scta5, c.cuc_scta6, c.cuc_scta7, c.cuc_tipo_ente, c.cuc_ente, c.cuc_consolida_ente) from CuentasConciliaEntity c")
    List<CuentasReglaDto> findAllDto();

    @Query("select new nafin.sica.persistence.dto.CuentasReglaDto(c.cuc_mod_sis_clave, c.cuc_mod_clave, c.cuc_clave, c.cuc_cuenta, c.cuc_scta1, c.cuc_scta2, c.cuc_scta3, c.cuc_scta4, c.cuc_scta5, c.cuc_scta6, c.cuc_scta7, c.cuc_tipo_ente, c.cuc_ente, c.cuc_consolida_ente) from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1")
    List<CuentasReglaDto> get_by_cuc_sis_clave(String cuc_sis_clave);

    @Query("select new nafin.sica.persistence.dto.CuentasReglaDto(c.cuc_mod_sis_clave, c.cuc_mod_clave, c.cuc_clave, c.cuc_cuenta, c.cuc_scta1, c.cuc_scta2, c.cuc_scta3, c.cuc_scta4, c.cuc_scta5, c.cuc_scta6, c.cuc_scta7, c.cuc_tipo_ente, c.cuc_ente, c.cuc_consolida_ente) from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1 and c.cuc_mod_clave = ?2")
    List<CuentasReglaDto> get_by_cuc_mod_clave(String cuc_sis_clave, String cuc_mod_clave);

    @Query("select new nafin.sica.persistence.dto.SistemFilterDto(c.cuc_mod_sis_clave) from CuentasConciliaEntity c group by c.cuc_mod_sis_clave order by c.cuc_mod_sis_clave")
    List<SistemFilterDto> getSistemFilter();

    @Query("select new nafin.sica.persistence.dto.ModulesFilterDto(c.cuc_mod_clave) from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1 group by c.cuc_mod_clave order by c.cuc_mod_clave")
    List<ModulesFilterDto> getModulesFilter(String cuc_mod_sis_clave);

    @Query("select c from CuentasConciliaEntity c")
    List<CuentasConciliaEntity> findAllCuentas();

}
