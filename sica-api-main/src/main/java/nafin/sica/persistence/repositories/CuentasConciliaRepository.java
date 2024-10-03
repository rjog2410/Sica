package nafin.sica.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.CuentasReglaDto;
import nafin.sica.persistence.dto.ModulesFilterDto;
import nafin.sica.persistence.dto.SistemFilterDto;
import nafin.sica.persistence.entity.CuentasConciliaEntity;

@Repository
public interface CuentasConciliaRepository extends CrudRepository<CuentasConciliaEntity, Integer> {

        @Query("select new nafin.sica.persistence.dto.CuentasReglaDto(c.cuc_mod_sis_clave, c.cuc_mod_clave, c.cuc_clave, c.cuc_cuenta, c.cuc_scta1, c.cuc_scta2, c.cuc_scta3, c.cuc_scta4, c.cuc_scta5, c.cuc_scta6, c.cuc_scta7, c.cuc_tipo_ente, c.cuc_ente, c.cuc_consolida_ente) from CuentasConciliaEntity c")
        List<CuentasReglaDto> findAllDto();

        @Query("select c from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1")
        List<CuentasConciliaEntity> get_by_cuc_sis_clave(String cuc_sis_clave);

        @Query("select c from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1 and c.cuc_mod_clave = ?2")
        List<CuentasConciliaEntity> get_by_cuc_mod_clave(String cuc_sis_clave, String cuc_mod_clave);

        @Query("select new nafin.sica.persistence.dto.SistemFilterDto(c.cuc_mod_sis_clave) from CuentasConciliaEntity c group by c.cuc_mod_sis_clave order by c.cuc_mod_sis_clave")
        List<SistemFilterDto> getSistemFilter();

        @Query("select new nafin.sica.persistence.dto.ModulesFilterDto(c.cuc_mod_clave) from CuentasConciliaEntity c where c.cuc_mod_sis_clave = ?1 group by c.cuc_mod_clave order by c.cuc_mod_clave")
        List<ModulesFilterDto> getModulesFilter(String cuc_mod_sis_clave);

        @Query("select c from CuentasConciliaEntity c")
        List<CuentasConciliaEntity> findAllCuentas();

        @Query(value = "SELECT MAX(c.cuc_clave), "
                        + "    MAX(DECODE(c.cuc_tipo_ente || c.cuc_ente || c.cuc_consolida_ente, 'N', 'S', 'N'))  "
                        + " FROM sica_cuentas_concilia c  " + " WHERE c.cuc_mod_sis_clave = :sistema "
                        + " AND c.cuc_mod_clave = :modulo " + "  AND c.cuc_cuenta = :cuenta  "
                        + " AND c.cuc_scta1 = :scta1 " + "  AND c.cuc_scta2 = :scta2 " + " AND c.cuc_scta3 = :scta3 "
                        + " AND c.cuc_scta4 = :scta4 "
                        + " AND NVL(c.cuc_tipo_ente, 0) = DECODE(c.cuc_tipo_ente || c.cuc_ente || c.cuc_consolida_ente, 'S', 0, 'N', 0, :ente) "
                        + " AND NVL(c.cuc_ente, 0) = DECODE(c.cuc_tipo_ente || c.cuc_ente || c.cuc_consolida_ente, 'S', 0, 'N', 0, :tipo_ente) ", nativeQuery = true)
        List<Object[]> ObtenerMaxClave(@Param("sistema") String sistema, @Param("modulo") String modulo,
                        @Param("cuenta") Integer cuenta, @Param("scta1") String scta1, @Param("scta2") String scta2,
                        @Param("scta3") String scta3, @Param("scta4") String scta4, @Param("ente") Integer ente,
                        @Param("tipo_ente") Integer tipo_ente);

        @Query(value = " SELECT  r.reg_secuencia, t.tit_columna, r.reg_valor,r.reg_operador, "
                        + "   'sicap001.a_numero(can_c'|| to_char(t.tit_columna)|| ') ' || decode(r.reg_operador,'COMO','like',r.reg_operador)|| ' (' || chr(39)||r.reg_valor||chr(39)||') and '   "
                        + "   FROM sica_cuentas_concilia  c, sica_titulos t, sica_reglas r"
                        + " WHERE  c.cuc_clave =  r.reg_cuc_clave "
                        + " AND c.cuc_mod_sis_clave = r.REG_TIT_MOD_SIS_CLAVE "
                        + " AND c.cuc_mod_clave = r.REG_TIT_MOD_CLAVE "
                        + " AND c.cuc_mod_sis_clave = t.tit_mod_sis_clave " + " AND c.cuc_mod_clave = t.tit_mod_clave "
                        + " AND r.reg_tit_columna = t.tit_columna " + " AND c.cuc_clave =  :maxclave "
                        + "  ORDER BY r.reg_secuencia,t.tit_columna ", nativeQuery = true)
        List<Object[]> ObtenerCondiciones(@Param("maxclave") String maxclave);

}
