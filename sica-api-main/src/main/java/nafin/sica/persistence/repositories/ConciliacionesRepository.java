package nafin.sica.persistence.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.ConciliacionSaldosDto;
import nafin.sica.persistence.entity.ConciliacionesEntity;

@Repository
public interface ConciliacionesRepository extends CrudRepository<ConciliacionesEntity, String> {

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo(String sistema, String modulo);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_oficina = ?3")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_oficina(String sistema, String modulo, Integer oficina);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_moneda = ?3")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_moneda(String sistema, String modulo, Integer moneda);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_moneda = ?3 and c.con_oficina = ?4")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_moneda_and_oficina(String sistema, String modulo,
            Integer moneda, Integer oficina);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha_carga = ?3")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha(String sistema, String modulo, LocalDate fecha);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha_carga = ?3 and c.con_moneda = ?4")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha_and_moneda(String sistema, String modulo,
            LocalDate fecha, Integer moneda);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha_carga = ?3 and c.con_oficina = ?4")
    List<ConciliacionSaldosDto> get_by_sistema_and_modulo_and_fecha_and_oficina(String sistema, String modulo,
            LocalDate fecha, Integer oficina);

    @Query("select new nafin.sica.persistence.dto.ConciliacionSaldosDto(c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha, c.con_oficina, c.con_moneda, c.con_cuenta, c.con_scta1, c.con_scta2, c.con_scta3, c.con_scta4, c.con_scta5, c.con_scta6, c.con_scta7, c.con_fecha_carga, c.con_tipo_ente, c.con_ente, c.con_importe_sif, c.con_importe_ao, ((CASE WHEN c.con_importe_sif IS NULL THEN 0 ELSE c.con_importe_sif END) - ((CASE WHEN c.con_importe_ao IS NULL THEN 0 ELSE c.con_importe_ao END))) ) from ConciliacionesEntity c where c.con_mod_sis_clave = ?1 and c.con_mod_clave = ?2 and c.con_fecha_carga = ?3 and c.con_oficina = ?4 and c.con_moneda = ?5")
    List<ConciliacionSaldosDto> get_by_all(String sistema, String modulo, LocalDate fecha, Integer oficina,
            Integer moneda);
}
