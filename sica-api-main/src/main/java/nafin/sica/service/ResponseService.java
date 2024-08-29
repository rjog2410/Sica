package nafin.sica.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ResponseService {
    final static Integer status200 = 200;
    final static Integer status400 = 400;
    final static Integer status503 = 503;

    // 200 con array de datos
    public Map<String, Object> buildJsonResponse(List<?> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", data);
        return response;
    }

    // 200 con array de datos
    public Map<String, Object> buildJsonResponseObject(Object object) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("data", object);
        return response;
    }

    public Map<String, Object> buildJsonResponseObjectDelete(Object object) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("Total Eliminados", object);
        return response;
    }

    // para eliminacion en array
    public Map<String, Object> buildJsonResponseUntil(List<?> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 100);
        response.put("data", data);
        return response;
    }

    // 200 con Msg
    public Map<String, Object> buildJsonResponseString(String Msg) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", Msg);
        return response;
    }

    // 200 con Msg
    public Map<String, Object> buildJsonResponseInt(Integer Id) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", Id);
        return response;
    }

    // 503 error en base
    public Map<String, Object> buildJsonErrorResponse(String Msg) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 500);
        response.put("error", HttpStatus.INTERNAL_SERVER_ERROR);
        response.put("message", Msg);
        return response;
    }

     // 503 error en base
     public Map<String, Object> buildJsonErrorValidateResponse(String Msg) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", HttpStatus.BAD_REQUEST);
        response.put("message", Msg);
        return response;
    }

    // 400 error en la recepcion de datos
    public Map<String, Object> buildJsonErrorValidate(List<?> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", HttpStatus.BAD_REQUEST);
        response.put("message", data);
        return response;
    }

    // 400 error en la recepcion de datos
    public Map<String, Object> buildJsonErrorValidateString() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", HttpStatus.BAD_REQUEST);
        response.put("message", "Datos incompletos ó incorrectos.");
        return response;
    }

    // 400 error en la recepcion de datos
    public Map<String, Object> buildJsonErrorValidateObject(Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", HttpStatus.BAD_REQUEST);
        response.put("message", data);
        return response;
    }

}
