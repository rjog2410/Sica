package nafin.sica.controllers.catalogos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ColumnasDto;
import nafin.sica.persistence.entity.ColumnasEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class ColumnasController {
    @Autowired
    ResponseService responseService;
    @Autowired
    SistemasRepository sistemasRepository;
    @Autowired
    ModuloRepository moduloRepository;
    @Autowired
    ColumnasRepository columnasRepository;

    String tit_mod_clave = null;
    String tit_mod_sis_clave = null;

    @PostMapping("/catalogos/columnas/get_all_titulos")
    public Map<String, Object> get_all_titulos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ColumnasDto> columnasDtos = columnasRepository.get_all_titulos();
            response = responseService.buildJsonResponseObject(columnasDtos);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/columnas/get_titulo_by_mod_clave")
    public Map<String, Object> get_titulo_by_mod_clave(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            tit_mod_clave = (String) data.get("mod_clave");
            tit_mod_sis_clave = (String) data.get("sis_clave");
            if (tit_mod_clave == null || tit_mod_sis_clave == null) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ColumnasDto> columnasDtos = columnasRepository.get_titulo_by_mod_clave(tit_mod_clave,
                    tit_mod_sis_clave);
            response = responseService.buildJsonResponseObject(columnasDtos);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/columnas/get_titulo_by_sis_clave")
    public Map<String, Object> get_titulo_by_sis_clave(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            tit_mod_sis_clave = (String) data.get("sis_clave");
            if (tit_mod_sis_clave == null || tit_mod_sis_clave.equals("")) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ColumnasDto> columnasDtos = columnasRepository.get_titulo_by_sis_clave(tit_mod_sis_clave);
            response = responseService.buildJsonResponseObject(columnasDtos);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/columnas/create")
    public Map<String, Object> create_titulos(@RequestBody @Valid ColumnasEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        System.out.println(columnasEntity.getTit_mod_sis_clave());
        System.out.println(columnasEntity.getTit_mod_clave());
        System.out.println(columnasEntity.getTit_columna());
        try {
            Optional<ColumnasEntity> valid_titulo = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
                    System.out.println(valid_titulo);
            if (valid_titulo.isPresent()) {
                response = responseService
                        .buildJsonErrorValidateResponse("Ya existe un registros con los datos enviados.");
            } else {
                ColumnasEntity newcColumnasEntity = columnasRepository.save(columnasEntity);
                response = responseService.buildJsonResponseString(newcColumnasEntity.getTit_descripcion());
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/columnas/update")
    public Map<String, Object> update_titulos(@RequestBody @Valid ColumnasEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ColumnasEntity> valid_titulo = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
            if (valid_titulo.isPresent()) {
                ColumnasEntity newcColumnasEntity = columnasRepository.save(columnasEntity);
                response = responseService.buildJsonResponseString(newcColumnasEntity.getTit_descripcion());
            } else {
                response = responseService
                        .buildJsonErrorValidateResponse("No existe un registro con los datos enviados.");
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/columnas/delete_titulo")
    public Map<String, Object> delete_titulo(@RequestBody @Valid ColumnasEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ColumnasEntity> columna = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
            if (columna.isPresent()) {
                columnasRepository.delete(columnasEntity);
                response = responseService.buildJsonResponseString("OK");
            } else {
                response = responseService.buildJsonErrorValidateString();
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/columnas/delete_all")
    public Map<String, Object> delete_all_titulos(@RequestBody @Valid List<ColumnasEntity> entities) {
        Map<String, Object> response = new HashMap<>();
        try {
            entities.forEach(entity -> {
                columnasRepository.delete(entity);
            });
            response = responseService.buildJsonResponseString("OK");
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
