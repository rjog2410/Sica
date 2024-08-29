package nafin.sica.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ColumnasDto;
import nafin.sica.persistence.dto.ModuloReporteDto;
import nafin.sica.persistence.dto.ModulosCatalogosDto;
import nafin.sica.persistence.dto.SistemDto;
import nafin.sica.persistence.entity.ColumnasEntity;
import nafin.sica.persistence.entity.ModulosEntity;
import nafin.sica.persistence.entity.SistemasEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ModuloRepository;
import nafin.sica.persistence.repositories.SistemasRepository;
import nafin.sica.service.ResponseService;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
public class CatalogosController {
    @Autowired
    ResponseService responseService;
    @Autowired
    SistemasRepository sistemasRepository;
    @Autowired
    ModuloRepository moduloRepository;
    @Autowired
    ColumnasRepository columnasRepository;

    

    // Modulos

  

    // Columnas

 

}
