package nafin.sica.controllers.catalogos;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.SistemDto;
import nafin.sica.persistence.entity.SistemasEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.ResponseService;
import nafin.sica.service.Utils;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class SistemasController {
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

    @Autowired
    ResponseDtoService responseDtoService;

    String sis_clave = null;

    // @PostMapping("/catalogos/sistemas/get_all")
    // public Map<String, Object> getAllSistems() {
    // Map<String, Object> response = new HashMap<>();
    // try {
    // List<SistemDto> sistemOptional =
    // sistemasRepository.findAllBySisClaveOnlyName();
    // response = responseService.buildJsonResponse(sistemOptional);
    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @PostMapping("/catalogos/sistemas/get_all")
    public ResponseEntity<ResponseDto> getAllSistems() {
        try {
            List<SistemDto> sistemOptional = sistemasRepository.findAllBySisClaveOnlyName();
            return ResponseEntity.ok().body(responseDtoService.buildJsonResponseObject(sistemOptional));
            // response = responseService.buildJsonResponse(sistemOptional);
        } catch (Exception e) {
            // response = responseService.buildJsonErrorResponse(e.getMessage());
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    // @PostMapping("/catalogos/sistemas/get_sistem")
    // public Map<String, Object> getSistem(@RequestBody Map<String, Object> data) {
    // Map<String, Object> response = new HashMap<>();
    // try {
    // sis_clave = (String) data.get("sis_clave");
    // if (utils.isNullOrEmpty(sis_clave)) {
    // return response = responseService.buildJsonErrorValidateString();
    // }
    // Optional<SistemDto> sistemOptional =
    // sistemasRepository.getBySis_Clave(sis_clave);
    // if (sistemOptional.isPresent()) {
    // response = responseService.buildJsonResponseObject(sistemOptional);
    // } else {
    // response = responseService.buildJsonErrorValidateString();
    // }

    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @PostMapping("/catalogos/sistemas/get_sistem")
    public ResponseEntity<ResponseDto> getSistem(@RequestBody Map<String, Object> data) {
        try {
            sis_clave = (String) data.get("sis_clave");
            if (utils.isNullOrEmpty(sis_clave)) {
                return ResponseEntity.ok().body(
                        responseDtoService.buildJsonErrorValidateResponse("La clave de sistema no debe ser nulo."));
            }
            Optional<SistemDto> sistemOptional = sistemasRepository.getBySis_Clave(sis_clave);
            if (sistemOptional.isPresent()) {
                return ResponseEntity.ok().body(responseDtoService.buildJsonResponseString(sis_clave));
            } else {
                return ResponseEntity.ok()
                        .body(responseDtoService.buildJsonErrorValidateResponse("La clave enviada no es válida."));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    // @Transactional
    // @PostMapping("/catalogos/sistemas/update")
    // public Map<String, Object> update_sistem(@RequestBody @Valid SistemasEntity
    // sistema) {
    // Map<String, Object> response = new HashMap<>();
    // String clave = sistema.getSis_clave();

    // try {
    // Optional<SistemDto> valid_sistem = sistemasRepository.getBySis_Clave(clave);
    // if (valid_sistem.isPresent()) {
    // SistemasEntity newSistemasEntity = sistemasRepository.save(sistema);
    // response =
    // responseService.buildJsonResponseString(newSistemasEntity.getSis_clave());
    // } else {
    // response = responseService
    // .buildJsonErrorValidateResponse("No existe un sistema con los datos
    // enviados.");
    // }

    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @Transactional
    @PostMapping("/catalogos/sistemas/update")
    public ResponseEntity<ResponseDto> update_sistem(@RequestBody @Valid SistemasEntity sistema) {
        String clave = sistema.getSis_clave();
        try {
            Optional<SistemDto> valid_sistem = sistemasRepository.getBySis_Clave(clave);
            if (valid_sistem.isPresent()) {
                SistemasEntity newSistemasEntity = sistemasRepository.save(sistema);
                return ResponseEntity.ok()
                        .body(responseDtoService.buildJsonResponseString(newSistemasEntity.getSis_clave().toString()));
            } else {
                return ResponseEntity.ok().body(responseDtoService
                        .buildJsonErrorValidateResponse("No existe un sistema con los datos enviados."));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    // @Transactional
    // @PostMapping("/catalogos/sistemas/create")
    // public Map<String, Object> create_sistem(@RequestBody @Valid SistemasEntity
    // sistema) {
    // Map<String, Object> response = new HashMap<>();
    // String clave = sistema.getSis_clave();

    // try {
    // Optional<SistemDto> valid_sistem = sistemasRepository.getBySis_Clave(clave);
    // if (valid_sistem.isPresent()) {
    // response = responseService.buildJsonErrorValidateResponse("Ya existe un
    // sistema con la Clave enviada.");
    // } else {
    // SistemasEntity newSistemasEntity = sistemasRepository.save(sistema);
    // response =
    // responseService.buildJsonResponseString(newSistemasEntity.getSis_clave());
    // }

    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @Transactional
    @PostMapping("/catalogos/sistemas/create")
    public ResponseEntity<ResponseDto> create_sistem(@RequestBody @Valid SistemasEntity sistema) {
        String clave = sistema.getSis_clave();
        try {
            Optional<SistemDto> valid_sistem = sistemasRepository.getBySis_Clave(clave);
            if (valid_sistem.isPresent()) {
                return ResponseEntity.ok().body(responseDtoService
                        .buildJsonErrorValidateResponse("Ya existe un sistema con la clave enviada."));
            } else {
                SistemasEntity newSistemasEntity = sistemasRepository.save(sistema);
                return ResponseEntity.ok()
                        .body(responseDtoService.buildJsonResponseString(newSistemasEntity.getSis_clave().toString()));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    // @Transactional
    // @PostMapping("/catalogos/sistemas/delete")
    // public Map<String, Object> delete_sistem(@RequestBody Map<String, Object>
    // data) {
    // Map<String, Object> response = new HashMap<>();
    // try {
    // sis_clave = (String) data.get("sis_clave");
    // if (utils.isNullOrEmpty(sis_clave)) {
    // return response = responseService.buildJsonErrorValidateString();
    // }
    // Optional<SistemasEntity> sistemOptional =
    // sistemasRepository.findById(sis_clave);
    // if (sistemOptional.isPresent()) {
    // moduloRepository.deleteByMod_sis_clave(sis_clave);
    // sistemasRepository.deleteById(sis_clave);
    // response = responseService.buildJsonResponseString(sis_clave);
    // } else {
    // response = responseService.buildJsonErrorValidateString();
    // }
    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @Transactional
    @PostMapping("/catalogos/sistemas/delete")
    public ResponseEntity<ResponseDto> delete_sistem(@RequestBody Map<String, Object> data) {
        try {
            sis_clave = (String) data.get("sis_clave");
            if (utils.isNullOrEmpty(sis_clave)) {
                return ResponseEntity.ok().body(
                        responseDtoService.buildJsonErrorValidateResponse("La clave del sistema no puede ser nulo."));
            }
            Optional<SistemasEntity> sistemOptional = sistemasRepository.findById(sis_clave);
            if (sistemOptional.isPresent()) {
                moduloRepository.deleteByMod_sis_clave(sis_clave);
                sistemasRepository.deleteById(sis_clave);
                return ResponseEntity.ok().body(responseDtoService.buildJsonResponseString(sis_clave));
            } else {
                return ResponseEntity.ok().body(
                        responseDtoService.buildJsonErrorValidateResponse("No existe sistema con la clave enviada."));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

    // @Transactional
    // @PostMapping("/catalogos/sistemas/delete_all")
    // public Map<String, Object> delete_sistem_all(@RequestBody Map<String,
    // List<String>> data) {
    // Map<String, Object> response = new HashMap<>();
    // List<String> sis_claves = new ArrayList<>();
    // try {
    // sis_claves = (List<String>) data.get("sis_claves");
    // if (sis_claves == null || sis_claves.size() == 0) {
    // return response = responseService.buildJsonErrorValidateString();
    // }
    // List<SistemasEntity> sistemOptional = (List<SistemasEntity>)
    // sistemasRepository.findAllById(sis_claves);
    // if (sis_claves.size() != sistemOptional.size()) {
    // response = responseService.buildJsonErrorValidateString();
    // } else {
    // sistemOptional.stream().forEach(sistem -> {
    // sistemasRepository.deleteById(sistem.getSis_clave());
    // });
    // response = responseService.buildJsonResponse(sis_claves);
    // }
    // } catch (Exception e) {
    // response = responseService.buildJsonErrorResponse(e.getMessage());
    // }
    // return response;
    // }

    @Transactional
    @PostMapping("/catalogos/sistemas/delete_all")
    public ResponseEntity<ResponseDto> delete_sistem_all(@RequestBody Map<String, List<String>> data) {
        List<String> sis_claves = new ArrayList<>();
        try {
            sis_claves = (List<String>) data.get("sis_claves");
            if (sis_claves == null || sis_claves.size() == 0) {
                return ResponseEntity.ok().body(responseDtoService.buildJsonErrorValidate());
            }
            List<SistemasEntity> sistemOptional = (List<SistemasEntity>) sistemasRepository.findAllById(sis_claves);
            if (sis_claves.size() != sistemOptional.size()) {
                return ResponseEntity.ok()
                        .body(responseDtoService.buildJsonErrorValidateResponse("Uno o más claves no existen."));
            } else {
                sistemOptional.stream().forEach(sistem -> {
                    sistemasRepository.deleteById(sistem.getSis_clave());
                });
                return ResponseEntity.ok()
                        .body(responseDtoService.buildJsonResponseString("Sistemas eliminados Correctamente."));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }
}
