package nafin.sica.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class AdministracionCargasService {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    Utils utils;

    String sistema = null;
    String modulo = null;
    String fecha_carga = null;
    String fecha_operativa = null;
    String tipoSalMov = null;
    String status = null;
    String msg = null;
    boolean validate = false;

    public Map<String, Object> get_carga_operativa(Map<String, Object> data, String origin) {
        Map<String, Object> response = new HashMap<>();
        try {
            getData(data);
            if (!status.equals("OK")) {
                response.put("status", status);
                response.put("message", msg);
                return response;
            }
            validate_data(origin);
            if (!status.equals("OK")) {
                response.put("status", status);
                response.put("message", msg);
                return response;
            }
            // System.out.println(response);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate fecha_carga_format = null;
            LocalDate fecha_operativa_format = null;
            if (fecha_carga != null) {
                fecha_carga_format = LocalDate.parse(fecha_carga, formatter);
            }
            if (fecha_operativa != null) {
                fecha_operativa_format = LocalDate.parse(fecha_operativa, formatter);
            }
            if (origin.equals("Operativa")) {
                List<Object[]> resultados = obtenerDatosCanasta(sistema, modulo, fecha_carga_format,
                        fecha_operativa_format, tipoSalMov);
                if (!status.equals("OK")) {
                    response.put("status", status);
                    response.put("message", msg);
                    return response;
                }
                // Crear una lista de mapas para almacenar los resultados
                List<Map<String, Object>> listaResultados = new ArrayList<>();
                for (Object[] resultado : resultados) {
                    Map<String, Object> mapaResultado = new HashMap<>();
                    mapaResultado.put("mod_sis_clave", resultado[0]);
                    mapaResultado.put("mod_clave", resultado[1]);
                    mapaResultado.put("fecha_carga", resultado[2]);
                    mapaResultado.put("fecha_informacion", resultado[3]);
                    mapaResultado.put("tipo_salmov", resultado[4]);
                    mapaResultado.put("RegistrosCargados", resultado[5]);
                    mapaResultado.put("RegistrosConciliados", resultado[6]);
                    listaResultados.add(mapaResultado);
                }
                response.put("data", listaResultados);
            } else {
                List<Object[]> resultados = null;
                if (tipoSalMov.equals("S")) {
                    resultados = obtenerDatosConciliaciones(sistema, modulo, fecha_carga_format,
                            fecha_operativa_format);
                } else {
                    resultados = obtenerDatosConciliacionesMovs(sistema, modulo, fecha_carga_format,
                            fecha_operativa_format);
                }

                if (!status.equals("OK")) {
                    response.put("status", status);
                    response.put("message", msg);
                    return response;
                }
                // Crear una lista de mapas para almacenar los resultados
                List<Map<String, Object>> listaResultados = new ArrayList<>();

                for (Object[] resultado : resultados) {
                    Map<String, Object> mapaResultado = new HashMap<>();
                    mapaResultado.put("sis_clave", resultado[0]);
                    mapaResultado.put("mod_clave", resultado[1]);
                    mapaResultado.put("fecha_carga", resultado[2]);
                    mapaResultado.put("fecha_conciliacion", resultado[3]);
                    mapaResultado.put("RegistrosCargados", resultado[4]);
                    listaResultados.add(mapaResultado);
                }

                response.put("data", listaResultados);
            }

        } catch (Exception e) {
            status = "Error";
            response.put("msg", e.getMessage());
        }
        response.put("status", status);
        response.put("message", msg);
        return response;
    }

    private void validate_data(String origin) {
        try {
            if (sistema != null && !sistema.equals("")) {
                validate = true;
            }
            if (modulo != null && !modulo.equals("")) {
                validate = true;
            }
            if (fecha_carga != null) {
                if (utils.is_validate_date(fecha_carga)) {
                    validate = true;
                } else {
                    status = "Error";
                    msg = "Formato de fecha incorrecto.";
                }
            }
            if (fecha_operativa != null) {
                if (utils.is_validate_date(fecha_operativa)) {
                    validate = true;
                } else {
                    status = "Error";
                    msg = "Formato de fecha incorrecto.";
                }
            }
            if (tipoSalMov != null && !tipoSalMov.equals("")) {
                if (tipoSalMov.equals("S") || tipoSalMov.equals("M")) {
                    validate = true;
                } else {
                    status = "Error";
                    msg = "Tipo de Movimiento Inválido";
                }
            } else {
                if (origin.equals("sif")) {
                    status = "Error";
                    msg = "El campo tipo de Movimiento no debe venir vacío.";
                }
            }

            if (!validate) {
                status = "Error";
                msg = "Debe ingresar al menos un filtro.";
            }
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
        }
    }

    private void getData(Map<String, Object> data) {
        try {
            status = "OK";
            sistema = (String) data.get("sistema");
            modulo = (String) data.get("modulo");
            fecha_carga = (String) data.get("fecha_carga");
            fecha_operativa = (String) data.get("fecha_informacion");
            tipoSalMov = (String) data.get("tipo_salmov");
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
        }

    }

    public List<Object[]> obtenerDatosCanasta(String canModSisClave, String canModClave, LocalDate canFechaCarga,
            LocalDate canFecha, String canTipoSalmov) {
        StringBuilder jpql = new StringBuilder("");
        try {
            jpql.append("SELECT c.can_mod_sis_clave, ");
            jpql.append("c.can_mod_clave, ");
            jpql.append("TO_CHAR(c.can_fecha_carga,'dd/mm/yyyy') as can_fecha_carga, ");
            jpql.append("TO_CHAR(c.can_fecha,'dd/mm/yyyy') as can_fecha, ");
            jpql.append("c.can_tipo_salmov, ");
            jpql.append("(SELECT COUNT(*) FROM CanastaEntity sub WHERE ");
            jpql.append("sub.can_mod_sis_clave = c.can_mod_sis_clave ");
            jpql.append("AND sub.can_mod_clave = c.can_mod_clave ");
            jpql.append("AND sub.can_fecha_carga = c.can_fecha_carga ");
            jpql.append("AND sub.can_fecha = c.can_fecha ");
            jpql.append("AND sub.can_tipo_salmov = c.can_tipo_salmov) as RegistrosCargados, ");
            jpql.append("(SELECT COUNT(*) FROM CanastaEntity sub WHERE ");
            jpql.append("sub.can_mod_sis_clave = c.can_mod_sis_clave ");
            jpql.append("AND sub.can_mod_clave = c.can_mod_clave ");
            jpql.append("AND sub.can_fecha_carga = c.can_fecha_carga ");
            jpql.append("AND sub.can_fecha = c.can_fecha ");
            jpql.append("AND sub.can_tipo_salmov = c.can_tipo_salmov ");
            jpql.append("AND sub.can_estatus = 'C') as RegistrosConciliados ");
            jpql.append("FROM CanastaEntity c WHERE 1=1 ");

            if (canModSisClave != null) {
                jpql.append("AND c.can_mod_sis_clave = :canModSisClave ");
            }
            if (canModClave != null) {
                jpql.append("AND c.can_mod_clave = :canModClave ");
            }
            if (canFechaCarga != null) {
                jpql.append("AND c.can_fecha_carga = :canFechaCarga ");
            }
            if (canFecha != null) {
                jpql.append("AND c.can_fecha = :canFecha ");
            }
            if (canTipoSalmov != null) {
                jpql.append("AND c.can_tipo_salmov = :canTipoSalmov ");
            }
            jpql.append(
                    "GROUP BY c.can_mod_sis_clave, c.can_mod_clave, c.can_fecha_carga, c.can_fecha, c.can_tipo_salmov");
            System.out.println(jpql);
            TypedQuery<Object[]> query = em.createQuery(jpql.toString(), Object[].class);
            if (canModSisClave != null) {
                query.setParameter("canModSisClave", canModSisClave);
            }
            if (canModClave != null) {
                query.setParameter("canModClave", canModClave);
            }
            if (canFechaCarga != null) {
                query.setParameter("canFechaCarga", canFechaCarga);
            }
            if (canFecha != null) {
                query.setParameter("canFecha", canFecha);
            }
            if (canTipoSalmov != null) {
                query.setParameter("canTipoSalmov", canTipoSalmov);
            }
            return query.getResultList();
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
            List<Object[]> error = new ArrayList<>();
            return error;
        }

    }

    public List<Object[]> obtenerDatosConciliaciones(String canModSisClave, String canModClave, LocalDate canFechaCarga,
            LocalDate canFecha) {
        StringBuilder jpql = new StringBuilder("");
        try {
            jpql.append("SELECT c.con_mod_sis_clave as sis_clave, ");
            jpql.append("c.con_mod_clave as mod_clave, ");
            jpql.append("TO_CHAR(c.con_fecha_carga,'dd/mm/yyyy') as fecha_carga, ");
            jpql.append("TO_CHAR(c.con_fecha,'dd/mm/yyyy') as fecha, ");
            // jpql.append("c.can_tipo_salmov, ");
            jpql.append("(SELECT COUNT(*) FROM ConciliacionesEntity sub WHERE ");
            jpql.append("sub.con_mod_sis_clave = c.con_mod_sis_clave ");
            jpql.append("AND sub.con_mod_clave = c.con_mod_clave ");
            jpql.append("AND sub.con_fecha = c.con_fecha ");
            jpql.append("AND sub.con_fecha_carga = c.con_fecha_carga) as RegistrosCargados ");
            jpql.append("FROM ConciliacionesEntity c WHERE 1=1 ");
            if (canModSisClave != null) {
                jpql.append("AND c.con_mod_sis_clave = :canModSisClave ");
            }
            if (canModClave != null) {
                jpql.append("AND c.con_mod_clave = :canModClave ");
            }
            if (canFechaCarga != null) {
                jpql.append("AND c.con_fecha_carga = :canFechaCarga ");
            }
            if (canFecha != null) {
                jpql.append("AND c.con_fecha = :canFecha ");
            }
            jpql.append("GROUP BY c.con_mod_sis_clave, c.con_mod_clave, c.con_fecha_carga, c.con_fecha");
            // System.out.println(jpql);
            TypedQuery<Object[]> query = em.createQuery(jpql.toString(), Object[].class);
            if (canModSisClave != null) {
                query.setParameter("canModSisClave", canModSisClave);
            }
            if (canModClave != null) {
                query.setParameter("canModClave", canModClave);
            }
            if (canFechaCarga != null) {
                query.setParameter("canFechaCarga", canFechaCarga);
            }
            if (canFecha != null) {
                query.setParameter("canFecha", canFecha);
            }
            return query.getResultList();
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
            List<Object[]> error = new ArrayList<>();
            return error;
        }

    }

    public List<Object[]> obtenerDatosConciliacionesMovs(String canModSisClave, String canModClave,
            LocalDate canFechaCarga, LocalDate canFecha) {
        StringBuilder jpql = new StringBuilder("");
        try {
            jpql.append("SELECT c.com_mod_sis_clave as sis_clave, ");
            jpql.append("c.com_mod_clave as mod_clave, ");
            jpql.append("TO_CHAR(c.com_fecha_carga,'dd/mm/yyyy') as fecha_carga, ");
            jpql.append("TO_CHAR(c.com_fecha,'dd/mm/yyyy') as fecha, ");
            // jpql.append("c.can_tipo_salmov, ");
            jpql.append("(SELECT COUNT(*) FROM ConciliacionesMovsEntity sub WHERE ");
            jpql.append("sub.com_mod_sis_clave = c.com_mod_sis_clave ");
            jpql.append("AND sub.com_mod_clave = c.com_mod_clave ");
            jpql.append("AND sub.com_fecha = c.com_fecha ");
            jpql.append("AND sub.com_fecha_carga = c.com_fecha_carga) as RegistrosCargados ");
            jpql.append("FROM ConciliacionesMovsEntity c WHERE 1=1 ");
            if (canModSisClave != null) {
                jpql.append("AND c.com_mod_sis_clave = :canModSisClave ");
            }
            if (canModClave != null) {
                jpql.append("AND c.com_mod_clave = :canModClave ");
            }
            if (canFechaCarga != null) {
                jpql.append("AND c.com_fecha_carga = :canFechaCarga ");
            }
            if (canFecha != null) {
                jpql.append("AND c.com_fecha = :canFecha ");
            }
            jpql.append("GROUP BY c.com_mod_sis_clave, c.com_mod_clave, c.com_fecha_carga, c.com_fecha");
            System.out.println(jpql);
            TypedQuery<Object[]> query = em.createQuery(jpql.toString(), Object[].class);
            if (canModSisClave != null) {
                query.setParameter("canModSisClave", canModSisClave);
            }
            if (canModClave != null) {
                query.setParameter("canModClave", canModClave);
            }
            if (canFechaCarga != null) {
                query.setParameter("canFechaCarga", canFechaCarga);
            }
            if (canFecha != null) {
                query.setParameter("canFecha", canFecha);
            }
            return query.getResultList();
        } catch (Exception e) {
            msg = e.getMessage();
            status = "Error";
            List<Object[]> error = new ArrayList<>();
            return error;
        }

    }

}
