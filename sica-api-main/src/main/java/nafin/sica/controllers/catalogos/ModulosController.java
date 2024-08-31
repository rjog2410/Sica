package nafin.sica.controllers.catalogos;

import java.util.ArrayList;
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
import nafin.sica.persistence.dto.ModuloReporteDto;
import nafin.sica.persistence.dto.ModulosCatalogosDto;
import nafin.sica.persistence.entity.ModulosEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ResponseService;
import nafin.sica.service.Utils;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class ModulosController {
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

    String mod_sis_clave = null;
    String mod_clave = null;

    @Transactional
    @PostMapping("/catalogos/modulos/create")
    public Map<String, Object> create_modules(@RequestBody @Valid ModulosEntity modulosEntity) {
        Map<String, Object> response = new HashMap<>();
        String clave_modulo = modulosEntity.getMod_clave();
        try {
            Optional<ModulosEntity> valid_module = moduloRepository.getModulo_by_clave(clave_modulo);
            if (valid_module.isPresent()) {
                response = responseService.buildJsonErrorValidateResponse("Ya existe un módulo con la misma clave.");
            } else {
                ModulosEntity newModulosEntity = moduloRepository.save(modulosEntity);
                response = responseService.buildJsonResponseString(newModulosEntity.getMod_clave());
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/modulos/update")
    public Map<String, Object> update_module(@RequestBody @Valid ModulosEntity modulosEntity) {
        Map<String, Object> response = new HashMap<>();
        String clave_modulo = modulosEntity.getMod_clave();
        try {
            Optional<ModulosEntity> valid_module = moduloRepository.getModulo_by_clave(clave_modulo);
            if (valid_module.isPresent()) {
                ModulosEntity newModulosEntity = moduloRepository.save(modulosEntity);
                response = responseService.buildJsonResponseString(newModulosEntity.getMod_clave());
            } else {
                response = responseService.buildJsonErrorValidateResponse("No existe un módulo con la clave enviada.");
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/modulos/get_module")
    public Map<String, Object> get_module(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            mod_sis_clave = (String) data.get("mod_sis_clave");
            if (utils.isNullOrEmpty(mod_sis_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ModulosCatalogosDto> modulosDTOs = moduloRepository.getModule(mod_sis_clave);
            response = responseService.buildJsonResponseObject(modulosDTOs);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/modulos/get_all")
    public Map<String, Object> get_all_module() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ModuloReporteDto> modulosEntities = moduloRepository.get_all_modules();
            response = responseService.buildJsonResponseObject(modulosEntities);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/modulos/delete_module")
    public Map<String, Object> delete_module(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            mod_clave = (String) data.get("mod_clave");
            if (utils.isNullOrEmpty(mod_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            Optional<ModulosEntity> module = moduloRepository.findById(mod_clave);
            if (module.isPresent()) {
                moduloRepository.deleteById(mod_clave);
                response = responseService.buildJsonResponseString(mod_clave);
            } else {
                response = responseService.buildJsonErrorValidateString();
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/modulos/delete_all")
    public Map<String, Object> delete_all_module(@RequestBody Map<String, List<String>> data) {
        Map<String, Object> response = new HashMap<>();
        List<String> mod_claves = new ArrayList<>();
        try {
            mod_claves = (List<String>) data.get("mod_claves");
            if (mod_claves.size() == 0 || mod_claves == null) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ModulosEntity> modules = (List<ModulosEntity>) moduloRepository.findAllById(mod_claves);
            if (mod_claves.size() != modules.size()) {
                response = responseService.buildJsonErrorValidateString();
            } else {
                moduloRepository.deleteAllById(mod_claves);
                response = responseService.buildJsonResponse(mod_claves);
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }
}
