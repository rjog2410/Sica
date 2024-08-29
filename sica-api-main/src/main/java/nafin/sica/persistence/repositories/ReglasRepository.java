package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import nafin.sica.persistence.dto.ReglasDto;
import nafin.sica.persistence.entity.ReglasEntity;
import nafin.sica.persistence.entity.ReglasId;

@Repository
public interface ReglasRepository extends CrudRepository<ReglasEntity, ReglasId> {

    @Query("select new nafin.sica.persistence.dto.ReglasDto(r.id.reg_cuc_clave, r.id.reg_tit_mod_sis_clave, r.id.reg_tit_mod_clave, r.id.reg_tit_columna, r.id.reg_secuencia, r.reg_operador, r.reg_valor) from ReglasEntity r where r.id.reg_cuc_clave = ?1 order by r.id.reg_tit_columna asc")
    List<ReglasDto> get_by_reg_cuc_clave(Integer id);

    @Query("select new nafin.sica.persistence.dto.ReglasDto(r.id.reg_cuc_clave, r.id.reg_tit_mod_sis_clave, r.id.reg_tit_mod_clave, r.id.reg_tit_columna, r.id.reg_secuencia, r.reg_operador, r.reg_valor) from ReglasEntity r where r.id.reg_cuc_clave = ?1 and r.id.reg_tit_mod_sis_clave = ?2 and r.id.reg_tit_mod_clave = ?3 and r.id.reg_tit_columna = ?4 and r.id.reg_secuencia = ?5 ")
    Optional<ReglasDto> get_regla_by_Id(Integer clave, String sistema, String modulo, Integer columna,
            Integer secuencia);

    @Query("select r from ReglasEntity r where r.id.reg_cuc_clave = ?1 and r.id.reg_tit_mod_sis_clave = ?2 and r.id.reg_tit_mod_clave = ?3 and r.id.reg_tit_columna = ?4 and r.id.reg_secuencia = ?5 ")
    Optional<ReglasEntity> get_regla_by_Id_Entity(Integer clave, String sistema, String modulo, Integer columna,
            Integer secuencia);

    @Modifying
    @Transactional
    @Query("delete from ReglasEntity r where r.id.reg_cuc_clave = ?1 and r.id.reg_tit_mod_sis_clave = ?2 and r.id.reg_tit_mod_clave = ?3 and r.id.reg_tit_columna = ?4 and r.id.reg_secuencia = ?5")
    Integer deleteReglas(Integer clave, String sistema, String modulo, Integer columna, Integer secuencia);

}
