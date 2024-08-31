package nafin.sica.controllers.reportes;

import java.io.File;
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

    @PostMapping("/reportes/reporte")
    ResponseEntity<Resource> get_report(@RequestBody Map<String, Object> data) {

        try {
            // response = reportService.get_report(data);
            // if (!response.getStatus().equals(200)) {
            // return ResponseEntity.noContent().build();
            // }
            List<Map<String, Object>> listData = reportService.get_list_report(data);
            System.out.println(listData);
            final File file = ResourceUtils.getFile("classpath:ReportsJasper/ReporteConciliaSaldos.jasper");
            // final File imgLogo = ResourceUtils.getFile("classpath:images/LogoNafin.png");
            final JasperReport report = (JasperReport) JRLoader.loadObject(file);

            final Map<String, Object> parameters = new HashMap<>();
            parameters.put("fecha_actual", "29/08/2024");
            parameters.put("fecha_proceso", "28/08/2024");
            parameters.put("hora_proceso", "15:00:00");
            // parameters.put("ds", new JRBeanArrayDataSource(listData));
            // response.getData()));
            JRDataSource dataSource = new JRBeanCollectionDataSource(listData);

            JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, dataSource);

            byte[] reporte = JasperExportManager.exportReportToPdf(jasperPrint);

            ContentDisposition contentDisposition = ContentDisposition.builder("attachment").filename("TestArchivo.pdf")
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(contentDisposition);

            return ResponseEntity.ok().contentLength((long) reporte.length).contentType(MediaType.APPLICATION_PDF)
                    .headers(headers).body(new ByteArrayResource(reporte));

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.noContent().build();
            // response = responseDtoService.buildJsonErrorResponse(e.getMessage());
            // ResponseEntity.internalServerError().body(response);
        }

    }

    @PostMapping("/reportes/reporte_data")
    ResponseEntity<ResponseDto> get_report_data(@RequestBody Map<String, Object> data) {
        try {
            // response = reportService.get_report(data);
            // if (!response.getStatus().equals(200)) {
            // return ResponseEntity.noContent().build();
            // }
            List<Map<String, Object>> listData = reportService.get_list_report(data);
            System.out.println(listData);
            return ResponseEntity.ok().body(responseDtoService.buildJsonResponseObject(listData));

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(responseDtoService.buildJsonErrorResponse(e.getMessage()));
        }

    }

}
