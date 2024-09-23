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
import nafin.sica.persistence.dto.CuentasReglaDto;
import nafin.sica.persistence.dto.ModulesFilterDto;
import nafin.sica.persistence.dto.SistemFilterDto;
import nafin.sica.persistence.entity.CuentasConciliaEntity;
import nafin.sica.persistence.repositories.CuentasConciliaRepository;
import nafin.sica.service.ResponseService;
import nafin.sica.service.Utils;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class CuentasReglaController {

    @Autowired
    CuentasConciliaRepository cuentasConciliaRepository;

    @Autowired
    ResponseService responseService;

    @Autowired
    Utils utils;

    String cuc_mod_clave = null;
    String cuc_mod_sis_clave = null;

    @PostMapping("/catalogos/cuentas_regla/get_sistems_filter")
    public Map<String, Object> get_sistem_filter() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<SistemFilterDto> sistemFilter = cuentasConciliaRepository.getSistemFilter();
            response = responseService.buildJsonResponseObject(sistemFilter);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/get_modules_filter")
    public Map<String, Object> get_modules_filter(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            cuc_mod_sis_clave = (String) data.get("cuc_mod_sis_clave");
            if (utils.isNullOrEmpty(cuc_mod_sis_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<ModulesFilterDto> modulosFilter = cuentasConciliaRepository.getModulesFilter(cuc_mod_sis_clave);
            response = responseService.buildJsonResponseObject(modulosFilter);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/get_all")
    public Map<String, Object> get_all() {
        Map<String, Object> response = new HashMap<>();
        try {
            //List<CuentasReglaDto> CuentasRegla = cuentasConciliaRepository.findAllDto();
            List<CuentasConciliaEntity> CuentasRegla = cuentasConciliaRepository.findAllCuentas();
            response = responseService.buildJsonResponseObject(CuentasRegla);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/get_by_cuc_mod_sis_clave")
    public Map<String, Object> get_by_cuc_sis_clave(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            cuc_mod_sis_clave = (String) data.get("cuc_mod_sis_clave");
            if (utils.isNullOrEmpty(cuc_mod_sis_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<CuentasConciliaEntity> cuentasRegla = cuentasConciliaRepository.get_by_cuc_sis_clave(cuc_mod_sis_clave);
            response = responseService.buildJsonResponseObject(cuentasRegla);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/get_by_cuc_mod_clave")
    public Map<String, Object> get_by_mod_clave(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            cuc_mod_clave = (String) data.get("cuc_mod_clave");
            cuc_mod_sis_clave = (String) data.get("cuc_mod_sis_clave");
            if (utils.isNullOrEmpty(cuc_mod_clave) || utils.isNullOrEmpty(cuc_mod_sis_clave)) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<CuentasConciliaEntity> cuentasRegla = cuentasConciliaRepository.get_by_cuc_mod_clave(cuc_mod_sis_clave,
                    cuc_mod_clave);
            response = responseService.buildJsonResponseObject(cuentasRegla);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/cuentas_regla/create")
    public Map<String, Object> create_cuentas_regla(@RequestBody @Valid CuentasConciliaEntity cuentasConciliaEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println(cuentasConciliaEntity.getCuc_clave().toString());
            if(utils.isNullOrEmpty(cuentasConciliaEntity.getCuc_clave().toString()) || utils.isNullOrZero(cuentasConciliaEntity.getCuc_clave())){
                CuentasConciliaEntity newCuentasConciliaEntity = cuentasConciliaRepository.save(cuentasConciliaEntity);
                response = responseService.buildJsonResponseInt(newCuentasConciliaEntity.getCuc_clave());
            }else{
                response = responseService.buildJsonErrorValidateResponse("Ya existen datos con ese registro.");
            }
           
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/catalogos/cuentas_regla/update")
    public Map<String, Object> update_cuentas_regla(@RequestBody @Valid CuentasConciliaEntity cuentasConciliaEntity) {
        Map<String, Object> response = new HashMap<>();
        try {
            if(utils.isNullOrEmpty(cuentasConciliaEntity.getCuc_clave().toString()) || utils.isNullOrZero(cuentasConciliaEntity.getCuc_clave())){
                response = responseService.buildJsonErrorValidateResponse("No existe registro previo de la cuenta a actualizar.");
            }else{
                CuentasConciliaEntity newCuentasConciliaEntity = cuentasConciliaRepository.save(cuentasConciliaEntity);
                response = responseService.buildJsonResponseInt(newCuentasConciliaEntity.getCuc_clave());
            }
            
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/cuentas_regla/delete")
    public Map<String, Object> delete_cuenta(@RequestBody Map<String, Integer> data) {
        Map<String, Object> response = new HashMap<>();
        Integer id = 0;
        try {
            id = data.get("id");
            Optional<CuentasConciliaEntity> cuentasOptional = cuentasConciliaRepository.findById(id);
            if (cuentasOptional.isPresent()) {
                cuentasConciliaRepository.deleteById(id);
                response = responseService.buildJsonResponseInt(id);
            } else {
                response = responseService.buildJsonErrorValidateString();
            }

        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @Transactional
    @PostMapping("/catalogos/cuentas_regla/delete_all")
    public Map<String, Object> delete_all_cuentas(@RequestBody Map<String, List<Integer>> data) {
        Map<String, Object> response = new HashMap<>();
        List<Integer> ids = new ArrayList<>();
        try {
            ids = data.get("ids");
            if (ids == null || ids.size() == 0) {
                return response = responseService.buildJsonErrorValidateString();
            }
            List<CuentasConciliaEntity> ListaCuentas = (List<CuentasConciliaEntity>) cuentasConciliaRepository
                    .findAllById(ids);
            if (ListaCuentas.size() == ids.size()) {
                cuentasConciliaRepository.deleteAllById(ids);
                response = responseService.buildJsonResponseObject(ids);
            } else {
                response = responseService.buildJsonErrorValidateString();
            }
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
