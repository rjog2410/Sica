package nafin.sica.controllers.reportes;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.service.ReportService;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.Utils;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class ReporteController {

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    ReportService reportService;

    @Autowired
    Utils utils;

    @PostMapping("/reportes/reporte")
    ResponseEntity<Resource> get_report(@RequestBody Map<String, Object> data) {
        try {
            List<Map<String, Object>> listData = reportService.get_list_report(data);
            String url_file = "";
            String file_name = "";
            if (data.get("agrupacion").equals("cuenta")) {
                url_file = "classpath:ReportsJasper/ReporteSaldos.jasper";
                file_name = "ReporteCuentas.pdf";
            } else {
                url_file = "classpath:ReportsJasper/ReporteSaldosEnteV3.jasper";
                file_name = "ReporteEntesV3.pdf";
            }
            final File file = ResourceUtils.getFile(url_file);
            final File imgLogo = ResourceUtils.getFile("classpath:images/LogoNafin.png");
            final JasperReport report = (JasperReport) JRLoader.loadObject(file);
            final Map<String, Object> parameters = new HashMap<>();

            parameters.put("fecha_principal", data.get("fecha"));
            parameters.put("fecha_proceso", utils.fecha_actual());
            parameters.put("hora_proceso", utils.hora_actual());
            parameters.put("imgLogo", new FileInputStream(imgLogo)); // Añadir el logotipo como parámetro
            parameters.put("SUBREPORT_DIR", getClass().getResource("/ReportsJasper/").toString()); // Ruta al directorio de subreportes
            JRDataSource dataSource = new JRBeanCollectionDataSource(listData);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, dataSource);

            byte[] reporte = JasperExportManager.exportReportToPdf(jasperPrint);

            ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename(file_name)
                    .build();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(contentDisposition);

            return ResponseEntity.ok().contentLength((long) reporte.length).contentType(MediaType.APPLICATION_PDF)
                    .headers(headers).body(new ByteArrayResource(reporte));

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }

    }

    @PostMapping("/reportes/reporte_data")
    ResponseEntity<ResponseDto> get_report_data(@RequestBody Map<String, Object> data) {
        try {
            List<Map<String, Object>> listData = reportService.get_list_report(data);
            return ResponseEntity.ok().body(responseDtoService.buildJsonResponseObject(listData));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }
    }

}
