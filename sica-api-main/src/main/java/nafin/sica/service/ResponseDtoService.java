package nafin.sica.service;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;

@Service
@AllArgsConstructor
public class ResponseDtoService {
    final static Integer status200 = 200;
    final static Integer status400 = 400;
    final static Integer status503 = 503;

    // 200 con array de datos
    public ResponseDto buildJsonResponse() {
        ResponseDto response = new ResponseDto();
        response.setStatus(200);
        response.setMessage("OK");
        return response;
    }

    // // 200 con array de datos
    // public ResponseDto buildJsonResponseObject(Object object) {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(200);
    // response.setData(object);
    // return response;
    // }

    // public ResponseDto buildJsonResponseObjectDelete(Object object) {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(200);
    // response.setMessage("OK");
    // response.setData(object);
    // return response;

    // }

    // 200 con Msg
    // public ResponseDto buildJsonResponseString(String Msg) {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(200);
    // response.setMessage(Msg);
    // return response;
    // }

    // 200 con Msg
    // public ResponseDto buildJsonResponseInt(Integer Id) {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(200);
    // response.setData(Id);
    // return response;
    // }

    // 503 error en base
    public ResponseDto buildJsonErrorResponse(String Msg) {
        ResponseDto response = new ResponseDto();
        response.setStatus(500);
        response.setMessage(Msg);
        return response;
    }

    // 503 error en base
    public ResponseDto buildJsonErrorValidateResponse(String Msg) {
        ResponseDto response = new ResponseDto();
        response.setStatus(400);
        response.setMessage(Msg);
        return response;
    }

    // 400 error en la recepcion de datos
    public ResponseDto buildJsonErrorValidate() {
        ResponseDto response = new ResponseDto();
        response.setStatus(400);
        response.setMessage("Datos incompletos ó incorrectos, favor de validar.");
        return response;
    }

    // // 400 error en la recepcion de datos
    // public ResponseDto buildJsonErrorValidateString() {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(400);
    // response.setMessage("Datos incompletos ó incorrectos, favor de validar.");
    // return response;
    // }

    // // 400 error en la recepcion de datos
    // public ResponseDto buildJsonErrorValidateObject(Map<String, Object> data) {
    // ResponseDto response = new ResponseDto();
    // response.setStatus(400);
    // response.setMessage("Datos incompletos ó incorrectos, favor de validar.");
    // return response;
    // }
}
