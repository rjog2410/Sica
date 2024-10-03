package nafin.sica.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ColumnasDto;
import nafin.sica.persistence.dto.ConciliacionSaldosDto;
import nafin.sica.persistence.entity.CuentasConciliaConsultaEntity;
import nafin.sica.persistence.repositories.ColumnasRepository;
import nafin.sica.persistence.repositories.ConciliacionesRepository;
import nafin.sica.persistence.repositories.CuentasConciliaRepository;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class ConsultasService {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    ConciliacionesRepository conciliacionesRepository;

    @Autowired
    Utils utils;

    @Autowired
    ColumnasRepository columnasRepository;

    @Autowired
    CuentasConciliaRepository cuentasConciliaRepository;

    String sistema = null;
    String modulo = null;
    String fecha = null;
    Integer moneda = null;
    Integer oficina = null;
    String status = null;
    String msg = null;
    LocalDate fecha_carga = null;

    public Map<String, Object> get_conciliacion_saldos(Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data_validate = new HashMap<>();
        try {
            get_data(data);
            if (status.equals("OK")) {
                data_validate = get_data_validated();
                if (status.equals("OK")) {
                    response.put("data", data_validate.get("data"));
                }
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    private Map<String, Object> get_data_validated() {
        Map<String, Object> response = new HashMap<>();
        List<ConciliacionSaldosDto> lista = null;
        try {
            if (moneda != null && oficina != null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_all(sistema, modulo, fecha_carga, oficina, moneda);
            } else if (moneda != null && oficina != null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_moneda_and_oficina(sistema, modulo,
                        moneda, oficina);
            } else if (moneda != null && oficina == null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha_and_moneda(sistema, modulo,
                        fecha_carga, moneda);
            } else if (moneda == null && oficina != null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha_and_oficina(sistema, modulo,
                        fecha_carga, oficina);
            } else if (moneda != null && oficina == null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_moneda(sistema, modulo, moneda);
            } else if (moneda == null && oficina != null && fecha_carga == null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_oficina(sistema, modulo, oficina);
            } else if (moneda == null && oficina == null && fecha_carga != null) {
                lista = conciliacionesRepository.get_by_sistema_and_modulo_and_fecha(sistema, modulo, fecha_carga);
            } else {
                lista = conciliacionesRepository.get_by_sistema_and_modulo(sistema, modulo);
            }
            response.put("data", lista);
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    public void get_data(Map<String, Object> data) {
        try {
            status = "OK";
            sistema = (String) data.get("sistema");
            if (utils.isNullOrEmpty(sistema)) {
                status = "Error";
                msg = "El sistema no puede ser nulo.";
                return;
            }
            modulo = (String) data.get("modulo");
            if (utils.isNullOrEmpty(modulo)) {
                status = "Error";
                msg = "El modulo no puede ser nulo.";
                return;
            }
            fecha = (String) data.get("fecha_informacion");
            if (fecha != null && !fecha.equals("")) {
                if (!is_validate_date(fecha)) {
                    status = "Error";
                    msg = "Formato de fecha incorrecto";
                    return;
                }
            }
            moneda = (Integer) data.get("moneda");
            if (moneda != null && moneda == 0) {
                status = "Error";
                msg = "La moneda no puede ser cero.";
                return;
            }
            oficina = (Integer) data.get("oficina");
            if (oficina != null && oficina == 0) {
                status = "Error";
                msg = "La oficina no puede ser cero.";
                return;
            }
        } catch (Exception e) {
            status = "Error";
            msg = e.getMessage();
        }
    }

    private boolean is_validate_date(String fecha) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            fecha_carga = LocalDate.parse(fecha, formatter);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public Map<String, Object> get_detail(CuentasConciliaConsultaEntity cuenta) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Error");
        // Obtenemos el numero de columnas
        List<ColumnasDto> Columnas = columnasRepository.get_titulo_by_mod_clave_consulta(cuenta.getCuc_mod_clave(),
                cuenta.getCuc_mod_sis_clave());
        response.put("num_columnas", Columnas.size());
        if (Columnas.isEmpty()) {
            return response;
        }
        List<String> cabeceras = new ArrayList<>();
        Columnas.forEach(dto -> {
            cabeceras.add(dto.getTitulo());
        });
        // System.out.println(Columnas);
        // Obtenemos la clave maxima.
        List<Object[]> maxClave = cuentasConciliaRepository.ObtenerMaxClave(cuenta.getCuc_mod_sis_clave(),
                cuenta.getCuc_mod_clave(), cuenta.getCuc_cuenta(), cuenta.getCuc_scta1(), cuenta.getCuc_scta2(),
                cuenta.getCuc_scta3(), cuenta.getCuc_scta4(), cuenta.getCuc_ente(), cuenta.getCuc_tipo_ente());
        String ClaveMax = null; // clave max
        for (Object[] resultado : maxClave) {
            ClaveMax = resultado[0].toString();
        }

        // Obtener las condiciones y creamos un mapa con ellas.

        List<Object[]> condiciones = cuentasConciliaRepository.ObtenerCondiciones(ClaveMax);
        condiciones.sort(Comparator.comparing((Object[] arr) -> (BigDecimal) arr[1]));
        Map<String, List<String>> condicionesMap = new HashMap<>();
        List<String> str_condition = new ArrayList<>();
        Integer validate_action = 0;
        for (Object[] resultado : condiciones) {

            validate_action = validate_condition(resultado[3].toString());
            if (validate_action.equals(1) || validate_action.equals(2)) {
                str_condition = condicionesMap.get(resultado[1].toString() + "_" + validate_action);
                if (str_condition != null) {
                    if (!str_condition.contains(resultado[2].toString())) {
                        str_condition.add(resultado[2].toString());
                        condicionesMap.put(resultado[1].toString() + "_" + validate_action, str_condition);
                    }
                } else {
                    str_condition = new ArrayList<>();
                    str_condition.add(resultado[2].toString());
                    condicionesMap.put(resultado[1].toString() + "_" + validate_action, str_condition);
                }
            } else {
                str_condition = condicionesMap
                        .get(resultado[1].toString() + "_" + validate_action + "_" + resultado[3].toString());
                if (str_condition == null) {
                    str_condition = new ArrayList<>();
                    str_condition.add(resultado[2].toString());
                    condicionesMap.put(resultado[1].toString() + "_" + validate_action + "_" + resultado[3].toString(),
                            str_condition);
                } else if (!str_condition.contains(resultado[2].toString())) {
                    str_condition.add(resultado[2].toString());
                    condicionesMap.put(resultado[1].toString() + "_" + validate_action + "_" + resultado[3].toString(),
                            str_condition);
                }
            }
        }
        List<Object[]> ResultFinal = ObtenerDatosFinales(cuenta, condicionesMap, Columnas.size());
        if (ResultFinal.isEmpty()) {
            return response;
        }
        List<Map<String, Object>> listaResultados = new ArrayList<>();
        for (Object[] resultado : ResultFinal) {
            Map<String, Object> mapaResultado = new HashMap<>();
            Columnas.forEach(dto -> {
                mapaResultado.put(dto.getTitulo(), resultado[dto.getNum_columnas() - 1]);
            });
            listaResultados.add(mapaResultado);

        }
        response.put("cabeceras", cabeceras);
        response.put("datos", listaResultados);
        response.put("status", "OK");
        return response;
    }

    public Integer validate_condition(String condicion) {
        if (condicion.contains("=")) {
            return 1; // significa igualdad
        } else if (condicion.contains("<>")) {
            return 2; 
        } else if (condicion.contains("<=")) {
            return 3;
        } else if (condicion.contains("<")) {
            return 4;
        } else if (condicion.contains(">=")) {
            return 5;
        } else if (condicion.contains(">")) {
            return 6;
        } else if (condicion.contains("+")) {
            return 7;
        } else if (condicion.contains("COMO")) {
            return 8;
        } else {
            return 9;
        }

    }

    public List<Object[]> ObtenerDatosFinales(CuentasConciliaConsultaEntity cuenta,
            Map<String, List<String>> condiciones, Integer num_columns) {
        StringBuilder jpql = new StringBuilder("");
        try {
            jpql.append("select ");
            for (int i = 1; i <= num_columns; i++) {
                if (i != 1) {
                    jpql.append(", c.can_c" + i);
                } else {
                    jpql.append(" c.can_c" + i);
                }
            }
            jpql.append(" FROM CanastaEntity c");
            jpql.append(" WHERE c.can_mod_sis_clave= :sistema");
            jpql.append(" AND c.can_mod_clave= :modulo");
            jpql.append(" AND c.can_fecha = to_date(:fecha,'dd/mm/yyyy') ");
            jpql.append(" AND c.can_tipo_salmov ='S' ");
            jpql.append(" AND c.can_estatus ='C' ");
            jpql.append(" AND c.can_c1= :oficina ");
            jpql.append(" AND c.can_c2= :moneda ");
            jpql.append(" AND c.can_c3= :tipo_ente ");
            jpql.append(" AND c.can_c4= :ente ");

            // Logica para agregar las condiciones.
            for (Map.Entry<String, List<String>> entry : condiciones.entrySet()) {
                String clave = entry.getKey();
                List<String> valor = entry.getValue();
                String[] parts = clave.split("_");
                String part1 = parts[0]; // 123
                String part2 = parts[1];
                String part3 = "";
                if (parts.length > 2) {
                    part3 = parts[2];
                    System.out.println(part3);
                }

                if (part2.equals("1")) {
                    String buffer = "";
                    for (String elemento : valor) {
                        buffer = buffer.equals("") ? elemento : buffer + " , " + elemento;
                    }
                    jpql.append(" AND c.can_c" + part1 + " in ( " + buffer + " )");
                } else if (part2.equals("2")) {
                    String buffer = "";
                    for (String elemento : valor) {
                        buffer = buffer.equals("") ? elemento : buffer + " , " + elemento;
                    }
                    jpql.append(" AND c.can_c" + part1 + " not in ( " + buffer + " )");
                } else if (part2.equals("8")) {
                    for (String elemento : valor) {
                        jpql.append(" AND c.can_c" + part1 + " LIKE %" + elemento + "%");
                    }
                } else { // los demas operadores.
                    for (String elemento : valor) {
                        jpql.append(" AND c.can_c" + part1 + " " + part3 + " " + elemento);
                    }
                }

                // System.out.println("Clave: " + clave + ", Valor: " + valor);
            }
            // System.out.println(jpql);
            TypedQuery<Object[]> query = em.createQuery(jpql.toString(), Object[].class);
            query.setParameter("sistema", cuenta.getCuc_mod_sis_clave());
            query.setParameter("modulo", cuenta.getCuc_mod_clave());
            query.setParameter("ente", cuenta.getCuc_ente().toString());
            query.setParameter("tipo_ente", cuenta.getCuc_tipo_ente().toString());
            query.setParameter("oficina", cuenta.getOficina().toString());
            query.setParameter("moneda", cuenta.getMoneda().toString());
            query.setParameter("fecha", cuenta.getCon_fecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            return query.getResultList();
        } catch (Exception e) {
            // System.out.println(e.getMessage());
            msg = e.getMessage();
            status = "Error";
            List<Object[]> error = new ArrayList<>();
            return error;
        }

    }

}
