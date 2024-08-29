package nafin.sica.persistence.repositories;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.entity.ExtractorSifEntity;

@Repository
public interface ExtractorSifRepository extends CrudRepository<ExtractorSifEntity, Long> {

    @Procedure(name = "obten_cuentas_conciliar")
    void ExtractorSifProcedure(@Param("sistema") String sistema, @Param("modulo") String modulo,
            @Param("fecha_inicial") LocalDate fecha_inicial, @Param("fecha_final") LocalDate fecha_final,
            @Param("saldos") String saldos, @Param("movimientos") String movimientos,
            @Param("borrar_info") String borrar_info);
}
