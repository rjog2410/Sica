package nafin.sica.persistence.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;

@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(name = "SICA.SICAP002.obten_cuentas_conciliar", procedureName = "obten_cuentas_conciliar", parameters = {
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "sistema", type = String.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "modulo", type = String.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "fecha_inicial", type = LocalDate.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "fecha_final", type = LocalDate.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "saldos", type = String.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "movimientos", type = String.class),
                @StoredProcedureParameter(mode = ParameterMode.IN, name = "borrar_info", type = String.class), }) })

@Entity
public class ExtractorSifEntity {

    @Id
    private Long id;
}
