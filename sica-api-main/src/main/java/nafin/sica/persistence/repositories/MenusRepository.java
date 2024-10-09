package nafin.sica.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import nafin.sica.persistence.dto.MenuDto;
import nafin.sica.persistence.entity.MenusEntity;

@Repository
public interface MenusRepository extends CrudRepository<MenusEntity, Integer> {

    @Query("select m from MenusEntity m where m.url = ?1")
    Optional<MenusEntity> validateUrl(String url);

    @Query("select m from MenusEntity m where m.id <> ?1 and m.url = ?2")
    Optional<MenusEntity> validateUrlWithId(Integer id, String url);

    @Query("select new nafin.sica.persistence.dto.MenuDto(m.id, m.nombre) from MenusEntity m order by m.nombre asc")
    List<MenuDto> getMenus();

}
