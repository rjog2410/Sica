package nafin.sica.persistence.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.ConciliacionSaldosDto;
import nafin.sica.persistence.entity.ConciliacionesEntity;

@Repository
public interface ConciliacionesRepository extends CrudRepository<ConciliacionesEntity, String> {

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo(String sistema, String modulo);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_oficina = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_oficina(String sistema, String modulo,
                        Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_moneda = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_moneda(String sistema, String modulo, Integer moneda);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_moneda = ?3 and c.con_oficina = ?4")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_moneda_and_oficina(String sistema, String modulo,
                        Integer moneda, Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha(String sistema, String modulo, LocalDate fecha);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha = ?3 and c.con_moneda = ?4")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha_and_moneda(String sistema, String modulo,
                        LocalDate fecha, Integer moneda);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha = ?3 and c.con_oficina = ?4")
        List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha_and_oficina(String sistema, String modulo,
                        LocalDate fecha, Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha = ?3 and c.con_oficina = ?4 and c.con_moneda = ?5")
        List<ConciliacionSaldosDto> get_by_all(String sistema, String modulo, LocalDate fecha, Integer oficina,
                        Integer moneda);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1")
        List<ConciliacionSaldosDto> get_by_sistema(String sistema);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_oficina = ?2")
        List<ConciliacionSaldosDto> get_by_sistema_and_oficina(String sistema, Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_moneda = ?2")
        List<ConciliacionSaldosDto> get_by_sistema_and_moneda(String sistema, Integer moneda);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_moneda = ?2 and c.con_oficina = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_moneda_and_oficina(String sistema, Integer moneda,
                        Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_fecha = ?2")
        List<ConciliacionSaldosDto> get_by_sistema_and_fecha(String sistema, LocalDate fecha);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_fecha = ?2 and c.con_moneda = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_fecha_and_moneda(String sistema, LocalDate fecha,
                        Integer moneda);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_fecha = ?2 and c.con_oficina = ?3")
        List<ConciliacionSaldosDto> get_by_sistema_and_fecha_and_oficina(String sistema, LocalDate fecha,
                        Integer oficina);

        @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, cast(CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END as double), cast(CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END as double) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_fecha = ?2 and c.con_oficina = ?3 and c.con_moneda = ?4")
        List<ConciliacionSaldosDto> get_by_all_modules(String sistema, LocalDate fecha, Integer oficina,
                        Integer moneda);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , e.ent_nombre " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " join sica_entes e on e.ent_numero = c.con_ente and e.tpe_clave = c.con_tipo_ente"
                        + " WHERE c.con_mod_sis_clave = :modSisClave AND c.con_mod_clave = :modClave "
                        + " and e.ofi_clave = o.clave_oficina and e.ofi_tipo = o.tipo and c.con_fecha = :fecha  ORDER BY c.con_mod_sis_clave asc, c.con_mod_clave asc,c.con_oficina asc,  c.con_moneda ASC, c.con_cuenta asc", nativeQuery = true)
        List<Object[]> get_reporte_one(@Param("modSisClave") String con_mod_sis_clave,
                        @Param("modClave") String con_mod_clave, @Param("fecha") LocalDate fecha);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , ' ' " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " WHERE c.con_ente is null and c.con_mod_sis_clave = :modSisClave AND c.con_mod_clave = :modClave and c.con_fecha = :fecha  ORDER BY c.con_mod_sis_clave asc, c.con_mod_clave asc,c.con_oficina asc,  c.con_moneda ASC, c.con_cuenta asc", nativeQuery = true)
        List<Object[]> get_reporte_two(@Param("modSisClave") String con_mod_sis_clave,
                        @Param("modClave") String con_mod_clave, @Param("fecha") LocalDate fecha);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , e.ent_nombre " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " join sica_entes e on e.ent_numero = c.con_ente and e.tpe_clave = c.con_tipo_ente"
                        + " WHERE c.con_mod_sis_clave = :modSisClave "
                        + " and e.ofi_clave = o.clave_oficina and e.ofi_tipo = o.tipo and c.con_fecha = :fecha ORDER BY c.con_mod_sis_clave asc, c.con_mod_clave asc,c.con_oficina asc,  c.con_moneda desc", nativeQuery = true)
        List<Object[]> get_reporte_one_sistem(@Param("modSisClave") String con_mod_sis_clave,
                        @Param("fecha") LocalDate fecha);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , ' ' " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " WHERE c.con_ente is null and c.con_mod_sis_clave = :modSisClave and c.con_fecha = :fecha ", nativeQuery = true)
        List<Object[]> get_reporte_two_sistem(@Param("modSisClave") String con_mod_sis_clave,
                        @Param("fecha") LocalDate fecha);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , e.ent_nombre " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " join sica_entes e on e.ent_numero = c.con_ente and e.tpe_clave = c.con_tipo_ente"
                        + " where e.ofi_clave = o.clave_oficina and e.ofi_tipo = o.tipo and c.con_fecha = :fecha ORDER BY c.con_mod_sis_clave asc, c.con_mod_clave asc,c.con_oficina asc,  c.con_moneda desc", nativeQuery = true)
        List<Object[]> get_reporte_one_all(@Param("fecha") LocalDate fecha);

        @Query(value = "SELECT c.con_mod_sis_clave, c.con_mod_clave ,c.con_oficina, o.nombre, c.con_moneda, m.mon_nombre, c.con_cuenta, cm.cue_nombre , "
                        + " (CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END), "
                        + " (CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END) "
                        + " , c.con_scta1, c.con_scta2 , c.con_scta3 ,c.con_scta4 " + " , c.con_tipo_ente, c.con_ente "
                        + " , ' ' " + "FROM sica_conciliaciones c "
                        + " JOIN sica_v_oficinas o ON o.clave_particular = c.con_oficina "
                        + " JOIN sica_monedas m ON m.mon_clave = c.con_moneda "
                        + " join sica_cuentas cm on cm.cue_mayor = c.con_cuenta and cm.cue_scta1 = '00' and cm.cue_scta2 = '00' and cm.cue_scta3 = '00' and cm.cue_scta4 = '00' "
                        + " join sica_cuentas c1 on c1.cue_mayor = c.con_cuenta and c1.cue_scta1 = c.con_scta1 and c1.cue_scta2 = '00' and c1.cue_scta3 = '00' and c1.cue_scta4 = '00' "
                        + " join sica_cuentas c2 on c2.cue_mayor = c.con_cuenta and c2.cue_scta1 = c.con_scta1 and c2.cue_scta2 = c.con_scta2 and c2.cue_scta3 = '00' and c2.cue_scta4 = '00' "
                        + " join sica_cuentas c3 on c3.cue_mayor = c.con_cuenta and c3.cue_scta1 = c.con_scta1 and c3.cue_scta2 = c.con_scta2 and c3.cue_scta3 = c.con_scta3 and c3.cue_scta4 = '00' "
                        + " join sica_cuentas c4 on c4.cue_mayor = c.con_cuenta and c4.cue_scta1 = c.con_scta1 and c4.cue_scta2 = c.con_scta2 and c4.cue_scta3 = c.con_scta3 and c4.cue_scta4 = c.con_scta4 "
                        + " WHERE c.con_ente is null and c.con_fecha = :fecha ORDER BY c.con_mod_sis_clave asc , c.con_mod_clave asc ,c.con_oficina asc,  c.con_moneda desc", nativeQuery = true)
        List<Object[]> get_reporte_two_all(@Param("fecha") LocalDate fecha);

}
