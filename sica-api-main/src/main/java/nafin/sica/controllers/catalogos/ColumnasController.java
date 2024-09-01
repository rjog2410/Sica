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
import nafin.sica.persistence.entity.ColumnasId;
import nafin.sica.persistence.entity.ColumnasValidateEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ResponseService;
import nafin.sica.service.Utils;

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

    @Autowired
    Utils utils;

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
            if (utils.isNullOrEmpty(tit_mod_clave) || utils.isNullOrEmpty(tit_mod_sis_clave)) {
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
            if (utils.isNullOrEmpty(tit_mod_sis_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ColumnasDto> columnasDtos = columnasRepository.get_titulo_by_sis_clave(tit_mod_sis_clave);
            response = responseService.buildJsonResponseObject(columnasDtos);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @SuppressWarnings("unused")
    @Transactional
    @PostMapping("/catalogos/columnas/create")
    public Map<String, Object> create_titulos(@RequestBody @Valid ColumnasValidateEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ColumnasEntity> valid_titulo = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
            System.out.println(valid_titulo);
            if (valid_titulo.isPresent()) {
                response = responseService
                        .buildJsonErrorValidateResponse("Ya existe un registros con los datos enviados.");
            } else {
                ColumnasId id = ColumnasId.builder().tit_mod_sis_clave(columnasEntity.getTit_mod_sis_clave())
                        .tit_mod_clave(columnasEntity.getTit_mod_clave()).tit_columna(columnasEntity.getTit_columna())
                        .build();
                ColumnasEntity newcColumnasEntity = ColumnasEntity.builder()
                        .tit_descripcion(columnasEntity.getTit_descripcion()).id(id).build();
                columnasRepository.save(newcColumnasEntity);
                response = responseService.buildJsonResponseString("Columna creada correctamente.");
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @SuppressWarnings("unused")
    @Transactional
    @PostMapping("/catalogos/columnas/update")
    public Map<String, Object> update_titulos(@RequestBody @Valid ColumnasValidateEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ColumnasEntity> valid_titulo = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
            if (valid_titulo.isPresent()) {
                ColumnasId id = ColumnasId.builder().tit_columna(columnasEntity.getTit_columna())
                        .tit_mod_clave(columnasEntity.getTit_mod_clave())
                        .tit_mod_sis_clave(columnasEntity.getTit_mod_sis_clave()).build();
                ColumnasEntity updateColumna = ColumnasEntity.builder().id(id)
                        .tit_descripcion(columnasEntity.getTit_descripcion()).build();
                columnasRepository.save(updateColumna);
                response = responseService.buildJsonResponseString("Columna actualizada correctamente.");
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
    public Map<String, Object> delete_titulo(@RequestBody @Valid ColumnasValidateEntity columnasEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ColumnasEntity> columna = columnasRepository.get_titulo(columnasEntity.getTit_mod_sis_clave(),
                    columnasEntity.getTit_mod_clave(), columnasEntity.getTit_columna());
            if (columna.isPresent()) {
                ColumnasId id = ColumnasId.builder().tit_columna(columnasEntity.getTit_columna())
                        .tit_mod_clave(columnasEntity.getTit_mod_clave())
                        .tit_mod_sis_clave(columnasEntity.getTit_mod_sis_clave()).build();
                columnasRepository.deleteById(id);
                response = responseService.buildJsonResponseString("Columna Eliminada Correctamente.");
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
    public Map<String, Object> delete_all_titulos(@RequestBody @Valid List<ColumnasValidateEntity> entities) {
        Map<String, Object> response = new HashMap<>();
        try {
            entities.forEach(entity -> {
                ColumnasId id = ColumnasId.builder().tit_columna(entity.getTit_columna())
                        .tit_mod_clave(entity.getTit_mod_clave()).tit_mod_sis_clave(entity.getTit_mod_sis_clave())
                        .build();
                columnasRepository.deleteById(id);
            });
            response = responseService.buildJsonResponseString("Columnas eliminadas correctamente");
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
