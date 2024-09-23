package nafin.sica.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
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

        // public ResponseDto get_report(Map<String, Object> data) {
        // try {

        // validate_data(data);
        // if (status.equals("Error")) {
        // return responseDtoService.buildJsonErrorValidateResponse(msg);
        // }

        // // pendiente validar permisos de usuario

        // List<Object[]> listado;
        // List<Object[]> listado_dos;

        // if (sistema.equals("TODOS")) {
        // listado =
        // conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
        // listado_dos =
        // conciliacionesRepository.get_reporte_two_all(utils.get_date(fecha));
        // } else if (modulo.equals("TODOS")) {
        // listado = conciliacionesRepository.get_reporte_one_sistem(sistema,
        // utils.get_date(fecha));
        // listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema,
        // utils.get_date(fecha));
        // } else {
        // // listado = conciliacionesRepository.get_reporte_one(sistema, modulo,
        // // utils.get_date(fecha));
        // // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo,
        // // utils.get_date(fecha));
        // listado = conciliacionesRepository.get_reporte_one(sistema, modulo,
        // utils.get_date(fecha));
        // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo,
        // utils.get_date(fecha));
        // }

        // // // Crear una lista de mapas para almacenar los resultados
        // List<Map<String, Object>> listaResultados = new ArrayList<>();
        // Map<String, Object> mapaResultado = new HashMap<>();
        // for (Object[] resultado : listado) {

        // Double importeSif = Double.parseDouble(resultado[8].toString());
        // Double importeAo = Double.parseDouble(resultado[9].toString());
        // mapaResultado.put("SISTEMA", resultado[0]);
        // mapaResultado.put("MODULO", resultado[1]);
        // mapaResultado.put("OFICINA", resultado[2]);
        // mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
        // mapaResultado.put("MONEDA", resultado[4]);
        // mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
        // mapaResultado.put("CUENTA", resultado[6]);
        // mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
        // mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
        // mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
        // mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
        // listaResultados.add(mapaResultado);
        // }
        // for (Object[] resultado : listado_dos) {
        // Double importeSif = Double.parseDouble(resultado[8].toString());
        // Double importeAo = Double.parseDouble(resultado[9].toString());
        // mapaResultado.put("SISTEMA", resultado[0]);
        // mapaResultado.put("MODULO", resultado[1]);
        // mapaResultado.put("OFICINA", resultado[2]);
        // mapaResultado.put("NOMBRE_OFICINA", resultado[3]);
        // mapaResultado.put("MONEDA", resultado[4]);
        // mapaResultado.put("NOMBRE_MONEDA", resultado[5]);
        // mapaResultado.put("CUENTA", resultado[6]);
        // mapaResultado.put("NOMBRE_CUENTA", resultado[7]);
        // mapaResultado.put("IMPORTE_SIF", utils.format_moneda(importeSif));
        // mapaResultado.put("IMPORTE_AO", utils.format_moneda(importeAo));
        // mapaResultado.put("DIFERENCIA", utils.format_moneda(importeSif - importeAo));
        // listaResultados.add(mapaResultado);
        // }
        // listaResultados.sort(Comparator.comparing((Map<String, Object> map) ->
        // map.get("SISTEMA").toString())
        // .thenComparing(map -> map.get("MODULO").toString())
        // .thenComparing(map -> (BigDecimal) map.get("OFICINA"))
        // .thenComparing(map -> (BigDecimal) map.get("MONEDA")));
        // return responseDtoService.buildJsonResponseObject(listaResultados);
        // } catch (Exception e) {
        // return responseDtoService.buildJsonErrorResponse(e.getMessage());
        // }
        // }

        public List<Map<String, Object>> get_list_report(Map<String, Object> data) {
                List<Map<String, Object>> listaResultados = new ArrayList<>();
                try {

                        validate_data(data);
                        if (status.equals("Error")) {
                                return listaResultados;
                        }

                        if (data.get("agrupacion").equals("cuenta")) {
                                // pendiente validar permisos de usuario

                                List<Object[]> listado;
                                List<Object[]> listado_dos;

                                // OBTENEMOS EL RESULTADO DE LOS QUERY
                                if (sistema.equals("TODOS")) {
                                        listado = conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                                        listado_dos = conciliacionesRepository
                                                        .get_reporte_two_all(utils.get_date(fecha));
                                } else if (modulo.equals("TODOS")) {
                                        listado = conciliacionesRepository.get_reporte_one_sistem(sistema,
                                                        utils.get_date(fecha));
                                        listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema,
                                                        utils.get_date(fecha));
                                } else {
                                        // // listado = conciliacionesRepository.get_reporte_one(sistema, modulo,
                                        // utils.get_date(fecha));
                                        // // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo,
                                        // utils.get_date(fecha));
                                        listado = conciliacionesRepository.get_reporte_one(sistema, modulo);
                                        listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo);
                                }

                                boolean first = true;
                                List<Object[]> combinados = new ArrayList<>();
                                combinados.addAll(listado);
                                combinados.addAll(listado_dos);
                                // se combinan y se ordenan
                                combinados.sort(Comparator.comparing((Object[] arr) -> arr[0].toString())
                                                .thenComparing(arr -> arr[1].toString())
                                                .thenComparing(arr -> (BigDecimal) arr[2])
                                                .thenComparing(arr -> (BigDecimal) arr[4])
                                                .thenComparing(arr -> new BigDecimal(arr[6].toString())));
                                String keyBefore = "";
                                String keyCurrent = "";
                                List<Map<String, Object>> ListadoFinal = new ArrayList<>();
                                Map<String, Object> object = new HashMap<>();
                                List<Map<String, Object>> detalles = new ArrayList<>();
                                BigDecimal account_current = new BigDecimal(0);
                                BigDecimal account_before = new BigDecimal(0);
                                Map<String, Object> detail = new HashMap<>();

                                // SE ITERA PARA OBTENER LA INFORMACIÓN CLASIFICADA
                                for (Object[] resultado : combinados) {
                                        keyCurrent = resultado[0] + "-" + resultado[1] + "-" + resultado[2] + "-"
                                                        + resultado[4];
                                        if (first) {
                                                keyBefore = keyCurrent;
                                                first = false;
                                        }
                                        account_current = (BigDecimal) resultado[6];
                                        if (!account_before.equals(account_current)
                                                        && !account_before.equals(new BigDecimal(0))) {
                                                detalles.add(new HashMap<>(detail));
                                                detail.clear();
                                        }
                                        if (!keyCurrent.equals(keyBefore)) {
                                                object.put("detalles", new ArrayList<>(detalles));
                                                ListadoFinal.add(new HashMap<>(object));
                                                detalles.clear();
                                                object.clear();
                                        }
                                        Double importeSif = Double.parseDouble(resultado[8].toString());
                                        Double importeAo = Double.parseDouble(resultado[9].toString());
                                        object.put("SISTEMA", resultado[0]);
                                        object.put("MODULO", resultado[1]);
                                        object.put("OFICINA", resultado[2]);
                                        object.put("NOMBRE_OFICINA", resultado[3]);
                                        object.put("MONEDA", resultado[4]);
                                        object.put("NOMBRE_MONEDA", resultado[5]);
                                        object.put("TOTAL_SIF", object.get("TOTAL_SIF") == null
                                                        ? utils.format_moneda(importeSif)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_SIF").toString()
                                                                                        .replace(",", ""))
                                                                        + importeSif));
                                        object.put("TOTAL_AO", object.get("TOTAL_AO") == null
                                                        ? utils.format_moneda(importeAo)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_AO").toString()
                                                                                        .replace(",", ""))
                                                                        + importeAo));
                                        object.put("TOTAL_DIF", object.get("TOTAL_DIF") == null
                                                        ? utils.format_moneda((importeSif - importeAo))
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_DIF").toString()
                                                                                        .replace(",", ""))
                                                                        + (importeSif - importeAo)));

                                        detail.put("CUENTA", resultado[6]);
                                        detail.put("NOMBRE_CUENTA", resultado[7]);
                                        detail.put("IMPORTE_SIF", detail.get("IMPORTE_SIF") == null ? importeSif
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(detail.get("IMPORTE_SIF")
                                                                                        .toString().replace(",", ""))
                                                                        + importeSif));
                                        detail.put("IMPORTE_AO", detail.get("IMPORTE_AO") == null ? importeAo
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(detail.get("IMPORTE_AO").toString()
                                                                                        .replace(",", ""))
                                                                        + importeAo));
                                        detail.put("DIFERENCIA", detail.get("DIFERENCIA") == null
                                                        ? (importeSif - importeAo)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(detail.get("DIFERENCIA").toString()
                                                                                        .replace(",", ""))
                                                                        + (importeSif - importeAo)));
                                        account_before = account_current;
                                        keyBefore = keyCurrent;
                                }
                                // agregar la ultima iteración
                                detalles.add(detail);
                                object.put("detalles", detalles);
                                ListadoFinal.add(object);

                                return ListadoFinal;
                        } else { /// entes
                                 // version 1
                                 // pendiente validar permisos de usuario

                                // List<Object[]> listado;
                                // List<Object[]> listado_dos;

                                // // OBTENEMOS EL RESULTADO DE LOS QUERY
                                // if (sistema.equals("TODOS")) {
                                // listado =
                                // conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                                // listado_dos = conciliacionesRepository
                                // .get_reporte_two_all(utils.get_date(fecha));
                                // } else if (modulo.equals("TODOS")) {
                                // listado = conciliacionesRepository.get_reporte_one_sistem(sistema,
                                // utils.get_date(fecha));
                                // listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema,
                                // utils.get_date(fecha));
                                // } else {
                                // listado = conciliacionesRepository.get_reporte_one(sistema, modulo);
                                // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo);
                                // }

                                // boolean first = true;
                                // List<Object[]> combinados = new ArrayList<>();
                                // combinados.addAll(listado);
                                // combinados.addAll(listado_dos);
                                // // se combinan y se ordenan
                                // combinados.sort(Comparator.comparing((Object[] arr) -> arr[0].toString())
                                // .thenComparing(arr -> arr[1].toString())
                                // .thenComparing(arr -> (BigDecimal) arr[2])
                                // .thenComparing(arr -> (BigDecimal) arr[4])
                                // .thenComparing(arr -> new BigDecimal(arr[6].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[10].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[11].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[12].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[13].toString())));
                                // String keyBefore = "";
                                // String keyCurrent = "";
                                // List<Map<String, Object>> ListadoFinal = new ArrayList<>();
                                // Map<String, Object> object = new HashMap<>();
                                // List<Map<String, Object>> detalles = new ArrayList<>();
                                // BigDecimal account_current = new BigDecimal(0);
                                // BigDecimal account_before = new BigDecimal(0);
                                // Map<String, Object> detail = new HashMap<>();
                                // // SE ITERA PARA OBTENER LA INFORMACIÓN CLASIFICADA
                                // for (Object[] resultado : combinados) {
                                // Double importeSif = Double.parseDouble(resultado[8].toString());
                                // Double importeAo = Double.parseDouble(resultado[9].toString());
                                // keyCurrent = resultado[0] + "-" + resultado[1] + "-" + resultado[2] + "-"
                                // + resultado[4] + "-" + resultado[6] + "-" + resultado[10] + "-"
                                // + resultado[11] + "-" + resultado[12] + "-" + resultado[13];
                                // if (first) {
                                // keyBefore = keyCurrent;
                                // first = false;
                                // }
                                // String fullaccount = resultado[6].toString() + resultado[10].toString()
                                // + resultado[11].toString() + resultado[12].toString()
                                // + resultado[13].toString() + resultado[15].toString();
                                // account_current = new BigDecimal(fullaccount);
                                // if (!account_before.equals(account_current)
                                // && !account_before.equals(new BigDecimal(0))) {
                                // detalles.add(new HashMap<>(detail));
                                // detail.clear();
                                // }
                                // if (!keyCurrent.equals(keyBefore)) {
                                // object.put("detalles", new ArrayList<>(detalles));
                                // ListadoFinal.add(new HashMap<>(object));
                                // detalles.clear();
                                // object.clear();
                                // }

                                // object.put("LLAVE", keyCurrent);
                                // object.put("SISTEMA", resultado[0]);
                                // object.put("MODULO", resultado[1]);
                                // object.put("OFICINA", resultado[2]);
                                // object.put("NOMBRE_OFICINA", resultado[3]);
                                // object.put("MONEDA", resultado[4]);
                                // object.put("NOMBRE_MONEDA", resultado[5]);
                                // object.put("CUENTA", resultado[6].toString());
                                // object.put("SCTA1", resultado[10].toString());
                                // object.put("SCTA2", resultado[11].toString());
                                // object.put("SCTA3", resultado[12].toString());
                                // object.put("SCTA4", resultado[13].toString());
                                // object.put("TOTAL_SIF", object.get("TOTAL_SIF") == null
                                // ? utils.format_moneda(importeSif)
                                // : utils.format_moneda(Double
                                // .parseDouble(object.get("TOTAL_SIF").toString()
                                // .replace(",", ""))
                                // + importeSif));
                                // object.put("TOTAL_AO", object.get("TOTAL_AO") == null
                                // ? utils.format_moneda(importeAo)
                                // : utils.format_moneda(Double
                                // .parseDouble(object.get("TOTAL_AO").toString()
                                // .replace(",", ""))
                                // + importeAo));
                                // object.put("TOTAL_DIF", object.get("TOTAL_DIF") == null
                                // ? utils.format_moneda((importeSif - importeAo))
                                // : utils.format_moneda(Double
                                // .parseDouble(object.get("TOTAL_DIF").toString()
                                // .replace(",", ""))
                                // + (importeSif - importeAo)));

                                // detail.put("ENTE", resultado[15].toString());
                                // detail.put("ENTE_NOMBRE", resultado[16]);
                                // detail.put("CUENTA", resultado[6].toString());
                                // detail.put("SCTA1", resultado[10].toString());
                                // detail.put("SCTA2", resultado[11].toString());
                                // detail.put("SCTA3", resultado[12].toString());
                                // detail.put("SCTA4", resultado[13].toString());
                                // detail.put("IMPORTE_SIF", detail.get("IMPORTE_SIF") == null
                                // ? utils.format_moneda(importeSif)
                                // : utils.format_moneda(Double
                                // .parseDouble(detail.get("IMPORTE_SIF")
                                // .toString().replace(",", ""))
                                // + importeSif));
                                // detail.put("IMPORTE_AO", detail.get("IMPORTE_AO") == null
                                // ? utils.format_moneda(importeAo)
                                // : utils.format_moneda(Double
                                // .parseDouble(detail.get("IMPORTE_AO").toString()
                                // .replace(",", ""))
                                // + importeAo));
                                // detail.put("DIFERENCIA", detail.get("DIFERENCIA") == null
                                // ? utils.format_moneda((importeSif - importeAo))
                                // : utils.format_moneda(Double
                                // .parseDouble(detail.get("DIFERENCIA").toString()
                                // .replace(",", ""))
                                // + (importeSif - importeAo)));
                                // account_before = account_current;
                                // keyBefore = keyCurrent;
                                // }
                                // // agregar la ultima iteración
                                // detalles.add(detail);
                                // object.put("detalles", detalles);
                                // ListadoFinal.add(object);

                                // return ListadoFinal;

                                // version 2
                                // pendiente validar permisos de usuario

                                // List<Object[]> listado;
                                // List<Object[]> listado_dos;

                                // // OBTENEMOS EL RESULTADO DE LOS QUERY
                                // if (sistema.equals("TODOS")) {
                                // listado =
                                // conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                                // listado_dos = conciliacionesRepository
                                // .get_reporte_two_all(utils.get_date(fecha));
                                // } else if (modulo.equals("TODOS")) {
                                // listado = conciliacionesRepository.get_reporte_one_sistem(sistema,
                                // utils.get_date(fecha));
                                // listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema,
                                // utils.get_date(fecha));
                                // } else {
                                // // listado = conciliacionesRepository.get_reporte_one(sistema, modulo,
                                // // utils.get_date(fecha));
                                // // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo,
                                // // utils.get_date(fecha));
                                // listado = conciliacionesRepository.get_reporte_one(sistema, modulo);
                                // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo);
                                // }

                                // boolean first = true;
                                // List<Object[]> combinados = new ArrayList<>();
                                // combinados.addAll(listado);
                                // combinados.addAll(listado_dos);
                                // // se combinan y se ordenan
                                // combinados.sort(Comparator.comparing((Object[] arr) -> arr[0].toString())
                                // .thenComparing(arr -> arr[1].toString())
                                // .thenComparing(arr -> (BigDecimal) arr[2])
                                // .thenComparing(arr -> (BigDecimal) arr[4])
                                // .thenComparing(arr -> new BigDecimal(arr[6].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[10].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[11].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[12].toString()))
                                // .thenComparing(arr -> new BigDecimal(arr[13].toString())));
                                // String keyBefore = "";
                                // String keyCurrent = "";
                                // List<Map<String, Object>> ListadoFinal = new ArrayList<>();
                                // Map<String, Object> object = new HashMap<>();
                                // Map<String, Object> map_subcuenta = new HashMap<>();
                                // List<Map<String, Object>> list_subcuent = new ArrayList<>();
                                // Map<String, Object> map_cuentas = new HashMap<>();
                                // List<Map<String, Object>> list_cuentas = new ArrayList<>();
                                // List<Map<String, Object>> entes_list = new ArrayList<>();
                                // String account_current = "";
                                // String account_before = "";
                                // String sub_account_current = "";
                                // String sub_account_before = "";
                                // Map<String, Object> entes = new HashMap<>();
                                // String ente_current = "";
                                // String ente_before = "";

                                // // SE ITERA PARA OBTENER LA INFORMACIÓN CLASIFICADA
                                // for (Object[] resultado : combinados) {
                                // ente_current = resultado[15].toString();
                                // keyCurrent = resultado[0] + "-" + resultado[1] + "-" + resultado[2] + "-"
                                // + resultado[4];
                                // account_current = resultado[6].toString();
                                // sub_account_current = resultado[6].toString() + resultado[10].toString()
                                // + resultado[11].toString() + resultado[12].toString()
                                // + resultado[13].toString();
                                // if (first) {
                                // keyBefore = keyCurrent;
                                // account_before = account_current;
                                // ente_before = ente_current;
                                // sub_account_before = sub_account_current;
                                // first = false;
                                // }

                                // if (!utils.isNullOrEmpty(sub_account_before)
                                // && !sub_account_before.equals(sub_account_current)) {
                                // entes_list.add(new HashMap<>(entes));
                                // entes.clear();
                                // map_subcuenta.put("entes", new ArrayList<>(entes_list));
                                // list_subcuent.add(new HashMap<>(map_subcuenta));
                                // entes.clear();
                                // map_subcuenta.clear();
                                // if (!utils.isNullOrEmpty(account_before)
                                // && !account_before.equals(account_current)) {
                                // map_cuentas.put("subcuentas", new ArrayList<>(list_subcuent));
                                // list_subcuent.clear();
                                // entes.clear();
                                // list_cuentas.add(new HashMap<>(map_cuentas));
                                // map_cuentas.clear();
                                // }
                                // }

                                // if (!keyCurrent.equals(keyBefore)) {
                                // object.put("cuentas", new ArrayList<>(list_cuentas));
                                // ListadoFinal.add(new HashMap<>(object));
                                // list_cuentas.clear();
                                // object.clear();
                                // }

                                // // //crear el objeto principal
                                // object.put("SISTEMA", resultado[0]);
                                // object.put("MODULO", resultado[1]);
                                // object.put("OFICINA", resultado[2]);
                                // object.put("NOMBRE_OFICINA", resultado[3]);
                                // object.put("MONEDA", resultado[4]);
                                // object.put("NOMBRE_MONEDA", resultado[5]);
                                // Double importeSif = Double.parseDouble(resultado[8].toString());
                                // Double importeAo = Double.parseDouble(resultado[9].toString());

                                // // objeto entes

                                // entes.put("ENTE", resultado[15].toString());
                                // entes.put("ENTE_NOMBRE", resultado[16]);
                                // entes.put("IMPORTE_SIF", entes.get("IMPORTE_SIF") == null
                                // ? utils.format_moneda(importeSif)
                                // : utils.format_moneda(Double
                                // .parseDouble(entes.get("IMPORTE_SIF").toString()
                                // .replace(",", ""))
                                // + importeSif));
                                // entes.put("IMPORTE_AO", entes.get("IMPORTE_AO") == null
                                // ? utils.format_moneda(importeAo)
                                // : utils.format_moneda(Double
                                // .parseDouble(entes.get("IMPORTE_AO").toString()
                                // .replace(",", ""))
                                // + importeAo));
                                // entes.put("DIFERENCIA", entes.get("DIFERENCIA") == null
                                // ? utils.format_moneda((importeSif - importeAo))
                                // : utils.format_moneda(Double
                                // .parseDouble(entes.get("DIFERENCIA").toString()
                                // .replace(",", ""))
                                // + (importeSif - importeAo)));

                                // // contenedor de las subcuentas

                                // map_subcuenta.put("CUENTA", resultado[6].toString());
                                // map_subcuenta.put("SCTA1", resultado[10].toString());
                                // map_subcuenta.put("SCTA2", resultado[11].toString());
                                // map_subcuenta.put("SCTA3", resultado[12].toString());
                                // map_subcuenta.put("SCTA4", resultado[13].toString());
                                // map_subcuenta.put("TOTAL_SIF_TABLA",
                                // map_subcuenta.get("TOTAL_SIF_TABLA") == null
                                // ? utils.format_moneda(importeSif)
                                // : utils.format_moneda(Double
                                // .parseDouble(map_subcuenta.get(
                                // "TOTAL_SIF_TABLA")
                                // .toString()
                                // .replace(",", ""))
                                // + importeSif));
                                // map_subcuenta.put("TOTAL_AO_TABLA", map_subcuenta.get("TOTAL_AO_TABLA") ==
                                // null
                                // ? utils.format_moneda(importeAo)
                                // : utils.format_moneda(Double
                                // .parseDouble(map_subcuenta.get("TOTAL_AO_TABLA")
                                // .toString().replace(",", ""))
                                // + importeAo));
                                // map_subcuenta.put("TOTAL_DIF_TABLA",
                                // map_subcuenta.get("TOTAL_DIF_TABLA") == null
                                // ? utils.format_moneda((importeSif - importeAo))
                                // : utils.format_moneda(Double
                                // .parseDouble(map_subcuenta.get(
                                // "TOTAL_DIF_TABLA")
                                // .toString()
                                // .replace(",", ""))
                                // + (importeSif - importeAo)));

                                // // contenedor de las cuentas
                                // map_cuentas.put("CUENTA", resultado[6].toString());
                                // map_cuentas.put("TOTAL_SIF_CUENTA", map_cuentas.get("TOTAL_SIF_CUENTA") ==
                                // null
                                // ? map_subcuenta.get("TOTAL_SIF_TABLA").toString()
                                // : utils.format_moneda(Double
                                // .parseDouble(map_cuentas.get("TOTAL_SIF_CUENTA")
                                // .toString().replace(",", ""))
                                // + importeSif));
                                // map_cuentas.put("TOTAL_AO_CUENTA", map_cuentas.get("TOTAL_AO_CUENTA") == null
                                // ? map_subcuenta.get("TOTAL_AO_TABLA")
                                // : utils.format_moneda(Double
                                // .parseDouble(map_cuentas.get("TOTAL_AO_CUENTA")
                                // .toString().replace(",", ""))
                                // + importeAo));
                                // map_cuentas.put("TOTAL_DIF_CUENTA", map_cuentas.get("TOTAL_DIF_CUENTA") ==
                                // null
                                // ? map_subcuenta.get("TOTAL_DIF_TABLA")
                                // : utils.format_moneda(Double
                                // .parseDouble(map_cuentas.get("TOTAL_DIF_CUENTA")
                                // .toString().replace(",", ""))
                                // + (importeSif - importeAo)));

                                // if (!ente_before.equals(ente_current)) {
                                // entes_list.add(new HashMap<>(entes));
                                // entes.clear();
                                // }
                                // keyBefore = keyCurrent;
                                // account_before = account_current;
                                // sub_account_before = sub_account_current;
                                // ente_before = ente_current;

                                // }
                                // // agregar la ultima iteración
                                // map_subcuenta.put("entes", new ArrayList<>(entes_list));
                                // list_subcuent.add(new HashMap<>(map_subcuenta));
                                // map_cuentas.put("subcuentas", new ArrayList<>(list_subcuent));
                                // list_subcuent.clear();
                                // entes.clear();
                                // list_cuentas.add(new HashMap<>(map_cuentas));
                                // object.put("cuentas", list_cuentas);
                                // ListadoFinal.add(new HashMap<>(object));
                                // entes.clear();
                                // entes_list.clear();
                                // map_subcuenta.clear();
                                // list_subcuent.clear();
                                // object.clear();

                                // return ListadoFinal;

                                ////// // // VERSION 3
                                List<Object[]> listado;
                                List<Object[]> listado_dos;

                                // OBTENEMOS EL RESULTADO DE LOS QUERY
                                if (sistema.equals("TODOS")) {
                                        listado = conciliacionesRepository.get_reporte_one_all(utils.get_date(fecha));
                                        listado_dos = conciliacionesRepository
                                                        .get_reporte_two_all(utils.get_date(fecha));
                                } else if (modulo.equals("TODOS")) {
                                        listado = conciliacionesRepository.get_reporte_one_sistem(sistema,
                                                        utils.get_date(fecha));
                                        listado_dos = conciliacionesRepository.get_reporte_two_sistem(sistema,
                                                        utils.get_date(fecha));
                                } else {
                                        // listado = conciliacionesRepository.get_reporte_one(sistema, modulo,
                                        // utils.get_date(fecha));
                                        // listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo,
                                        // utils.get_date(fecha));
                                        listado = conciliacionesRepository.get_reporte_one(sistema, modulo);
                                        listado_dos = conciliacionesRepository.get_reporte_two(sistema, modulo);
                                }

                                boolean first = true;
                                List<Object[]> combinados = new ArrayList<>();
                                combinados.addAll(listado);
                                combinados.addAll(listado_dos);
                                // se combinan y se ordenan
                                combinados.sort(Comparator.comparing((Object[] arr) -> arr[0].toString())
                                                .thenComparing(arr -> arr[1].toString())
                                                .thenComparing(arr -> (BigDecimal) arr[2])
                                                .thenComparing(arr -> (BigDecimal) arr[4])
                                                .thenComparing(arr -> new BigDecimal(arr[6].toString()))
                                                .thenComparing(arr -> new BigDecimal(arr[10].toString()))
                                                .thenComparing(arr -> new BigDecimal(arr[11].toString()))
                                                .thenComparing(arr -> new BigDecimal(arr[12].toString()))
                                                .thenComparing(arr -> new BigDecimal(arr[13].toString())));
                                String keyBefore = "";
                                String keyCurrent = "";
                                List<Map<String, Object>> ListadoFinal = new ArrayList<>();
                                Map<String, Object> object = new HashMap<>();
                                Map<String, Object> map_subcuenta = new HashMap<>();
                                List<Map<String, Object>> list_subcuent = new ArrayList<>();
                                List<Map<String, Object>> entes_list = new ArrayList<>();
                                String sub_account_current = "";
                                String sub_account_before = "";
                                Map<String, Object> entes = new HashMap<>();
                                String ente_current = "";
                                String ente_before = "";

                                // SE ITERA PARA OBTENER LA INFORMACIÓN CLASIFICADA
                                for (Object[] resultado : combinados) {
                                        ente_current = resultado[15].toString();
                                        keyCurrent = resultado[0] + "-" + resultado[1] + "-" + resultado[2] + "-"
                                                        + resultado[4] + "-" + resultado[6].toString();
                                        sub_account_current = resultado[6].toString() + "-" + resultado[10].toString()
                                                        + "-" + resultado[11].toString() + "-"
                                                        + resultado[12].toString() + "-" + resultado[13].toString();
                                        if (first) {
                                                keyBefore = keyCurrent;
                                                ente_before = ente_current;
                                                sub_account_before = sub_account_current;
                                                first = false;
                                        }

                                        if (!utils.isNullOrEmpty(sub_account_before)
                                                        && !sub_account_before.equals(sub_account_current)) {
                                                entes_list.add(new HashMap<>(entes));
                                                entes.clear();
                                                map_subcuenta.put("entes", new ArrayList<>(entes_list));
                                                list_subcuent.add(new HashMap<>(map_subcuenta));
                                                entes.clear();
                                                map_subcuenta.clear();

                                        }

                                        if (!keyCurrent.equals(keyBefore)) {
                                                object.put("subcuentas", new ArrayList<>(list_subcuent));
                                                list_subcuent.clear();
                                                entes.clear();
                                                ListadoFinal.add(new HashMap<>(object));
                                                object.clear();
                                        }

                                        // //crear el objeto principal
                                        object.put("SISTEMA", resultado[0]);
                                        object.put("MODULO", resultado[1]);
                                        object.put("OFICINA", resultado[2]);
                                        object.put("NOMBRE_OFICINA", resultado[3]);
                                        object.put("MONEDA", resultado[4]);
                                        object.put("NOMBRE_MONEDA", resultado[5]);
                                        Double importeSif = Double.parseDouble(resultado[8].toString());
                                        Double importeAo = Double.parseDouble(resultado[9].toString());

                                        // objeto entes
                                        entes.put("SUBCUENTA", sub_account_current);
                                        entes.put("ENTE", resultado[15].toString());
                                        entes.put("ENTE_NOMBRE", resultado[16]);
                                        entes.put("IMPORTE_SIF", entes.get("IMPORTE_SIF") == null
                                                        ? utils.format_moneda(importeSif)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(entes.get("IMPORTE_SIF").toString()
                                                                                        .replace(",", ""))
                                                                        + importeSif));
                                        entes.put("IMPORTE_AO", entes.get("IMPORTE_AO") == null
                                                        ? utils.format_moneda(importeAo)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(entes.get("IMPORTE_AO").toString()
                                                                                        .replace(",", ""))
                                                                        + importeAo));
                                        entes.put("DIFERENCIA", entes.get("DIFERENCIA") == null
                                                        ? utils.format_moneda((importeSif - importeAo))
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(entes.get("DIFERENCIA").toString()
                                                                                        .replace(",", ""))
                                                                        + (importeSif - importeAo)));

                                        // contenedor de las subcuentas

                                        map_subcuenta.put("SUBCUENTA_BASE", sub_account_current);
                                        map_subcuenta.put("TOTAL_SIF_TABLA",
                                                        map_subcuenta.get("TOTAL_SIF_TABLA") == null
                                                                        ? utils.format_moneda(importeSif)
                                                                        : utils.format_moneda(Double
                                                                                        .parseDouble(map_subcuenta.get(
                                                                                                        "TOTAL_SIF_TABLA")
                                                                                                        .toString()
                                                                                                        .replace(",", ""))
                                                                                        + importeSif));
                                        map_subcuenta.put("TOTAL_AO_TABLA", map_subcuenta.get("TOTAL_AO_TABLA") == null
                                                        ? utils.format_moneda(importeAo)
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(map_subcuenta.get("TOTAL_AO_TABLA")
                                                                                        .toString().replace(",", ""))
                                                                        + importeAo));
                                        map_subcuenta.put("TOTAL_DIF_TABLA",
                                                        map_subcuenta.get("TOTAL_DIF_TABLA") == null
                                                                        ? utils.format_moneda((importeSif - importeAo))
                                                                        : utils.format_moneda(Double
                                                                                        .parseDouble(map_subcuenta.get(
                                                                                                        "TOTAL_DIF_TABLA")
                                                                                                        .toString()
                                                                                                        .replace(",", ""))
                                                                                        + (importeSif - importeAo)));

                                        // contenedor de las cuentas
                                        object.put("CUENTA_BASE", resultado[6].toString());
                                        object.put("TOTAL_SIF_CUENTA", object.get("TOTAL_SIF_CUENTA") == null
                                                        ? map_subcuenta.get("TOTAL_SIF_TABLA").toString()
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_SIF_CUENTA")
                                                                                        .toString().replace(",", ""))
                                                                        + importeSif));
                                        object.put("TOTAL_AO_CUENTA", object.get("TOTAL_AO_CUENTA") == null
                                                        ? map_subcuenta.get("TOTAL_AO_TABLA")
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_AO_CUENTA")
                                                                                        .toString().replace(",", ""))
                                                                        + importeAo));
                                        object.put("TOTAL_DIF_CUENTA", object.get("TOTAL_DIF_CUENTA") == null
                                                        ? map_subcuenta.get("TOTAL_DIF_TABLA")
                                                        : utils.format_moneda(Double
                                                                        .parseDouble(object.get("TOTAL_DIF_CUENTA")
                                                                                        .toString().replace(",", ""))
                                                                        + (importeSif - importeAo)));

                                        if (!ente_before.equals(ente_current)) {
                                                entes_list.add(new HashMap<>(entes));
                                                entes.clear();
                                        }
                                        keyBefore = keyCurrent;
                                        sub_account_before = sub_account_current;
                                        ente_before = ente_current;

                                }
                                // agregar la ultima iteración
                                entes_list.add(new HashMap<>(entes));
                                entes.clear();
                                map_subcuenta.put("entes", new ArrayList<>(entes_list));
                                list_subcuent.add(new HashMap<>(map_subcuenta));
                                object.put("subcuentas", new ArrayList<>(list_subcuent));
                                list_subcuent.clear();
                                entes.clear();
                                ListadoFinal.add(new HashMap<>(object));
                                entes.clear();
                                entes_list.clear();
                                map_subcuenta.clear();
                                list_subcuent.clear();
                                object.clear();

                                return ListadoFinal;
                        }

                } catch (Exception e) {
                        System.err.println(e.getMessage());
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
