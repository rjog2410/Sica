package nafin.sica.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.repositories.ConciliacionesRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class ReportService {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    ConciliacionesRepository conciliacionesRepository;

    @Autowired
    Utils utils;

    String sistema;
    String modulo;
    String fecha;
    String status;
    String msg;

    public ResponseDto get_report(Map<String, Object> data) {
        try {

            validate_data(data);
            if (status.equals("Error")) {
                return responseDtoService.buildJsonErrorValidateResponse(msg);
            }

            // pendiente validar permisos de usuario

            List<Object[]> listado;
            List<Object[]> listado_dos;

            if (sistema.equals("TODOS")) {
                listado = conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two_all(utils.get_date(fecha));
            } else if (modulo.equals("TODOS")) {
                listado = conciliacionesRepository.get_reporte_one_sistem(sistema, utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema, utils.get_date(fecha));
            } else {
                listado = conciliacionesRepository.get_reporte_one(sistema, modulo, utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo, utils.get_date(fecha));
            }

            // // Crear una lista de mapas para almacenar los resultados
            List<Map<String, Object>> listaResultados = new ArrayList<>();
            Map<String, Object> mapaResultado = new HashMap<>();
            for (Object[] resultado : listado) {

                Double importeSif = Double.parseDouble(resultado[8].toString());
                Double importeAo = Double.parseDouble(resultado[9].toString());
                mapaResultado.put("SISTEMA", resultado[0]);
                mapaResultado.put("MODULO", resultado[1]);
                mapaResultado.put("OFICINA", resultado[2]);
                mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
                mapaResultado.put("MONEDA", resultado[4]);
                mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
                mapaResultado.put("CUENTA", resultado[6]);
                mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
                mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
                mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
                mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
                listaResultados.add(mapaResultado);
            }
            for (Object[] resultado : listado_dos) {
                Double importeSif = Double.parseDouble(resultado[8].toString());
                Double importeAo = Double.parseDouble(resultado[9].toString());
                mapaResultado.put("SISTEMA", resultado[0]);
                mapaResultado.put("MODULO", resultado[1]);
                mapaResultado.put("OFICINA", resultado[2]);
                mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
                mapaResultado.put("MONEDA", resultado[4]);
                mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
                mapaResultado.put("CUENTA", resultado[6]);
                mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
                mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
                mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
                mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
                listaResultados.add(mapaResultado);
            }
            listaResultados.sort(Comparator.comparing((Map<String, Object> map) -> map.get("SISTEMA").toString())
                    .thenComparing(map -> map.get("MODULO").toString())
                    .thenComparing(map -> (BigDecimal) map.get("OFICINA"))
                    .thenComparing(map -> (BigDecimal) map.get("MONEDA")));
            return responseDtoService.buildJsonResponseObject(listaResultados);
        } catch (Exception e) {
            return responseDtoService.buildJsonErrorResponse(e.getMessage());
        }
    }

    @SuppressWarnings("unused")
    public List<Map<String, Object>> get_list_report(Map<String, Object> data) {
        List<Map<String, Object>> listaResultados = new ArrayList<>();
        try {

            validate_data(data);
            if (status.equals("Error")) {
                return listaResultados;
            }

            // pendiente validar permisos de usuario

            List<Object[]> listado;
            List<Object[]> listado_dos;

            if (sistema.equals("TODOS")) {
                listado = conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two_all(utils.get_date(fecha));
            } else if (modulo.equals("TODOS")) {
                listado = conciliacionesRepository.get_reporte_one_sistem(sistema, utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema, utils.get_date(fecha));
            } else {
                listado = conciliacionesRepository.get_reporte_one(sistema, modulo, utils.get_date(fecha));
                listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo, utils.get_date(fecha));
            }

            // // Crear una lista de mapas para almacenar los resultados
            String sis = "";
            String mod = "";
            String ofi = "";
            String mon = "";
            boolean first = true;

            Map<String, Object> mapaResultado = new HashMap<>();
            
            for (Object[] resultado : listado) {
                Double importeSif = Double.parseDouble(resultado[8].toString());
                Double importeAo = Double.parseDouble(resultado[9].toString());
                String key = resultado[0] + "-" + resultado[1] + "-" + resultado[2] + "-" + resultado[4];

                // if(sis.equals(resultado[0].toString()) && mod.equals(resultado[1].toString()) && ofi.equals(resultado[2].toString()) && mon.equals(resultado[4].toString())){

                // }
                // if(first){
                //     sis = resultado[0].toString();
                //     mod = resultado[1].toString();
                //     ofi = resultado[2].toString();
                //     mon = resultado[4].toString();
                //     first = false;
                // }
                mapaResultado.put("SISTEMA", resultado[0]);
                mapaResultado.put("MODULO", resultado[1]);
                mapaResultado.put("OFICINA", resultado[2]);
                mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
                mapaResultado.put("MONEDA", resultado[4]);
                mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
                mapaResultado.put("CUENTA", resultado[6]);
                mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
                mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
                mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
                mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
                listaResultados.add(mapaResultado);
            }

            for (Object[] resultado : listado_dos) {
                Double importeSif = Double.parseDouble(resultado[8].toString());
                Double importeAo = Double.parseDouble(resultado[9].toString());
                mapaResultado.put("SISTEMA", resultado[0]);
                mapaResultado.put("MODULO", resultado[1]);
                mapaResultado.put("OFICINA", resultado[2]);
                mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
                mapaResultado.put("MONEDA", resultado[4]);
                mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
                mapaResultado.put("CUENTA", resultado[6]);
                mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
                mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
                mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
                mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
                listaResultados.add(mapaResultado);
            }




            listaResultados.sort(Comparator.comparing((Map<String, Object> map) -> map.get("SISTEMA").toString())
                    .thenComparing(map -> map.get("MODULO").toString())
                    .thenComparing(map -> (BigDecimal) map.get("OFICINA"))
                    .thenComparing(map -> (BigDecimal) map.get("MONEDA")));

            // Transformación de datos
             List<Map<String, Object>> transformedData = listaResultados.stream()
                .collect(Collectors.groupingBy(
                        item -> Arrays.asList(
                                item.get("SISTEMA"),
                                item.get("MODULO"),
                                item.get("NOMBRE_OFICINA"),
                                item.get("NOMBRE_MONEDA"),
                                item.get("OFICINA"),
                                item.get("MONEDA")
                        ),
                        LinkedHashMap::new,
                        Collectors.mapping(item -> {
                            Map<String, Object> details = new LinkedHashMap<>(item);
                            details.remove("SISTEMA");
                            details.remove("MODULO");
                            details.remove("NOMBRE_OFICINA");
                            details.remove("NOMBRE_MONEDA");
                            details.remove("MONEDA");
                            details.remove("OFICINA");
                            return details;
                        }, Collectors.toList())
                ))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> group = new LinkedHashMap<>();
                    List<Object> key = entry.getKey();
                    group.put("SISTEMA", key.get(0).toString());
                    group.put("MODULO", key.get(1).toString());
                    group.put("OFICINA", key.get(2).toString());
                    group.put("MONEDA", key.get(3).toString());
                    group.put("detalles", entry.getValue());
                    return group;
                })
                .collect(Collectors.toList());

        // Resultado final
        System.out.println(transformedData);
        System.out.println(listaResultados);

            return transformedData;
        } catch (Exception e) {
            return listaResultados;
        }
    }

    private void validate_data(Map<String, Object> data) {
        status = "OK";
        sistema = (String) data.get("sistema");
        modulo = (String) data.get("modulo");
        fecha = (String) data.get("fecha");
        if (utils.isNullOrEmpty(sistema)) {
            status = "Error";
            msg = "El sistema no puede ser nulo.";
            return;
        }
        if (utils.isNullOrEmpty(modulo)) {
            status = "Error";
            msg = "El Módulo no puede ser nulo.";
            return;
        }
        if (utils.isNullOrEmpty(fecha)) {
            status = "Error";
            msg = "La fecha no puede ser nulo.";
            return;
        } else {
            if (!utils.is_validate_date(fecha)) {
                status = "Error";
                msg = "Formato de Fecha inválida.";
                return;
            }
        }
    }

}
