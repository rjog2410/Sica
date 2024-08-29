package nafin.sica.controllers.consultas;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.entity.MonedaEntity;
import nafin.sica.persistence.entity.OficinasEntity;
import nafin.sica.persistence.repositories.MonedaRepository;
import nafin.sica.persistence.repositories.OficinasRepository;
import nafin.sica.service.ResponseService;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class CatalogosConsultas {

    @Autowired
    ResponseService responseService;

    @Autowired
    MonedaRepository monedaRepository;

    @Autowired
    OficinasRepository oficinasRepository;

    @PostMapping("/consultas/catalogos/monedas")
    public Map<String, Object> get_monedas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<MonedaEntity> moneda = (List<MonedaEntity>) monedaRepository.findAll();
            response = responseService.buildJsonResponseObject(moneda);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

    @PostMapping("/consultas/catalogos/oficinas")
    public Map<String, Object> get_oficinas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<OficinasEntity> oficinas = (List<OficinasEntity>) oficinasRepository.findAll();
            response = responseService.buildJsonResponseObject(oficinas);
        } catch (Exception e) {
            response = responseService.buildJsonErrorResponse(e.getMessage());
        }
        return response;
    }

}
