package nafin.sica.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import nafin.sica.persistence.dto.ErrorResponse;

@RestControllerAdvice
public class HandlerException {

    Map<String, Object> response = new HashMap<>();

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> violationSQL(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder().status(409)
                .message("Datos Incorrectos, violación de integridad en base, favor de validar.").build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Map<String, Object> ViolationData(Exception ex) {
        response.put("status", 400);
        response.put("message",
                "No se detectan los parámetros ó tienen datos incorrectos, favor de validar su información.");
        return response;
    }

    @ExceptionHandler(UnexpectedRollbackException.class)
    public ResponseEntity<ErrorResponse> violationSQL_multiple(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder().status(409)
                .message("Datos Incorrectos, violación de integridad en base, favor de validar.").build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> Invalid_Data(Exception ex) {
        try {
            ErrorResponse errorResponse = ErrorResponse.builder().status(400)
                    .message("Datos Incorrectos favor de validar.").build();

            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = ErrorResponse.builder().status(400)
                    .message("Datos Incorrectos favor de validar.").build();

            return ResponseEntity.badRequest().body(errorResponse);
        }

    }

}
