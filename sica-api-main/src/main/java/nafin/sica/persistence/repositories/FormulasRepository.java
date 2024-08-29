package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import nafin.sica.persistence.dto.FormulasDto;
import nafin.sica.persistence.entity.FormulasEntity;
import nafin.sica.persistence.entity.FormulasId;

@Repository
public interface FormulasRepository extends CrudRepository<FormulasEntity, FormulasId> {
    @Query("select new nafin.sica.persistence.dto.FormulasDto(r.id.for_cuc_clave, r.id.for_tit_mod_sis_clave, r.id.for_tit_mod_clave, r.id.for_tit_columna, r.id.for_secuencia, r.for_operador) from FormulasEntity r where r.id.for_cuc_clave = ?1 order by r.id.for_secuencia asc")
    List<FormulasDto> get_by_for_cuc_clave(Integer id);

    @Query("select new nafin.sica.persistence.dto.FormulasDto(r.id.for_cuc_clave, r.id.for_tit_mod_sis_clave, r.id.for_tit_mod_clave, r.id.for_tit_columna, r.id.for_secuencia, r.for_operador) from FormulasEntity r where r.id.for_cuc_clave = ?1 and r.id.for_tit_mod_sis_clave = ?2 and r.id.for_tit_mod_clave = ?3 and r.id.for_tit_columna = ?4 and r.id.for_secuencia = ?5 ")
    Optional<FormulasDto> get_formula_by_Id(Integer clave, String sistema, String modulo, Integer columna,
            Integer secuencia);

    @Modifying
    @Transactional
    @Query("delete from FormulasEntity r where r.id.for_cuc_clave = ?1 and r.id.for_tit_mod_sis_clave = ?2 and r.id.for_tit_mod_clave = ?3 and r.id.for_tit_columna = ?4 and r.id.for_secuencia = ?5")
    void delete_formula(Integer clave, String sistema, String modulo, Integer columna, Integer secuencia);


}
