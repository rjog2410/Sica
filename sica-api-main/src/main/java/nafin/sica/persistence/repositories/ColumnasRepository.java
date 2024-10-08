package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.ColumnasDto;
import nafin.sica.persistence.dto.ModulesFilterDto;
import nafin.sica.persistence.dto.SistemFilterDto;
import nafin.sica.persistence.entity.ColumnasEntity;
import nafin.sica.persistence.entity.ColumnasId;

@Repository
public interface ColumnasRepository extends CrudRepository<ColumnasEntity, ColumnasId> {

    @Query("select new nafin.sica.persistence.dto.ColumnasDto(t.id.tit_columna, t.tit_descripcion, t.id.tit_mod_sis_clave, t.id.tit_mod_clave) from ColumnasEntity t")
    List<ColumnasDto> get_all_titulos();

    @Query("select new nafin.sica.persistence.dto.ColumnasDto(t.id.tit_columna, t.tit_descripcion, t.id.tit_mod_sis_clave, t.id.tit_mod_clave) from ColumnasEntity t where t.id.tit_mod_clave = ?1 and t.id.tit_mod_sis_clave = ?2")
    List<ColumnasDto> get_titulo_by_mod_clave(String tit_mod_clave, String tit_mod_sis_clave);

    @Query("select new nafin.sica.persistence.dto.ColumnasDto(t.id.tit_columna, t.tit_descripcion, t.id.tit_mod_sis_clave, t.id.tit_mod_clave) from ColumnasEntity t where t.id.tit_mod_sis_clave = ?1")
    List<ColumnasDto> get_titulo_by_sis_clave(String tit_mod_sis_clave);

    @Query("select c from ColumnasEntity c where c.id.tit_mod_sis_clave = ?1 and c.id.tit_mod_clave = ?2 and c.id.tit_columna = ?3")
    Optional<ColumnasEntity> get_titulo(String sistema, String modulo, Integer columna);

    @Query("select c from ColumnasEntity c where c.id.tit_mod_sis_clave = ?1 and c.id.tit_mod_clave = ?2")
    List<ColumnasEntity> get_titulos_concilia(String sistema, String modulo);

    @Query("select new nafin.sica.persistence.dto.ColumnasDto(t.id.tit_columna, t.tit_descripcion, t.id.tit_mod_sis_clave, t.id.tit_mod_clave) from ColumnasEntity t where t.id.tit_mod_clave = ?1 and t.id.tit_mod_sis_clave = ?2 order by t.id.tit_columna asc")
    List<ColumnasDto> get_titulo_by_mod_clave_consulta(String tit_mod_clave, String tit_mod_sis_clave);

    @Query("select new nafin.sica.persistence.dto.SistemFilterDto(c.id.tit_mod_sis_clave) from ColumnasEntity c group by c.id.tit_mod_sis_clave order by c.id.tit_mod_sis_clave")
    List<SistemFilterDto> getSistemFilter();

    @Query("select new nafin.sica.persistence.dto.ModulesFilterDto(c.id.tit_mod_clave) from ColumnasEntity c where c.id.tit_mod_sis_clave = ?1 group by c.id.tit_mod_clave order by c.id.tit_mod_clave")
    List<ModulesFilterDto> getModulesFilter(String sistema);
}
