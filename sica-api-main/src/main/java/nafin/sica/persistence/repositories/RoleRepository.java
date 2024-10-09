package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.RolDto;
import nafin.sica.persistence.entity.RolesEntity;

@Repository
public interface RoleRepository extends CrudRepository<RolesEntity, Integer> {
    @Query("select r from RolesEntity r where r.nombre = ?1")
    Optional<RolesEntity> findByNombre(String nombre);

    // @Query("select r from RolesEntity r where r.nombre = ?1 and r.id =?2")
    // Optional<RolesEntity> validateRol(String nombre, Integer id);

    @Query("select r from RolesEntity r where r.nombre = ?1 and r.id <>?2")
    Optional<RolesEntity> findByNombreValidate(String nombre, Integer id);

    // @Query("SELECT r FROM RolesEntity r JOIN FETCH r.RolPantallaEntity rp JOIN
    // FETCH rp.PantallaEntity WHERE r.id = :idRol")
    // Optional<RolesEntity> findByIdWithPantallas(@Param("idRol") Integer idRol);

    @Query("SELECT r FROM RolesEntity r JOIN FETCH r.rolPantalla rp JOIN FETCH rp.pantallas WHERE r.id = :id")
    Optional<RolesEntity> findByIdWithPantallas(@Param("id") Integer id);

    @Query("select new nafin.sica.persistence.dto.RolDto(r.id, r.nombre) from RolesEntity r order by r.nombre asc")
    List<RolDto> ListRoles();
}
