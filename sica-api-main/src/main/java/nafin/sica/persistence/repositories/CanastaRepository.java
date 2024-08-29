package nafin.sica.persistence.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.CanastaDto;
import nafin.sica.persistence.entity.CanastaEntity;

@Repository
public interface CanastaRepository extends CrudRepository<CanastaEntity, String> {

    @Query("select new nafin.sica.persistence.dto.CanastaDto(c.can_mod_sis_clave, c.can_mod_clave, c.can_fecha_carga, c.can_fecha, c.can_tipo_salmov,("+
    " 1 "
    +"), 1) from CanastaEntity c "
    +"where c.can_mod_sis_clave = ?1 and c.can_mod_clave = ?2 and c.can_fecha_carga = ?3 and c.can_fecha = ?4 and c.can_tipo_salmov = ?5 group by  can_mod_sis_clave," + 
                "    c.can_mod_clave," + 
                "    c.can_fecha_carga," + 
                "    c.can_fecha," + 
                "    c.can_tipo_salmov")
    List<CanastaDto> get_carga_operativa(String sistema, String modulo, LocalDate fecha_carga,
            LocalDate fecha_informacion, String tipo_conciliacion);

}
