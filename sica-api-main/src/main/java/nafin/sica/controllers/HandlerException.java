package nafin.sica.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ErrorResponse;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.service.ResponseDtoService;

@RestControllerAdvice
@RequiredArgsConstructor
public class HandlerException {

    @Autowired
    ResponseDtoService responseDtoService;

    Map<String, Object> response = new HashMap<>();

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> violationSQL(Exception ex) {
        // ErrorResponse errorResponse = ErrorResponse.builder().status(409)
        // .message("Datos Incorrectos, violación de integridad en base, favor de
        // validar.").build();
        ErrorResponse errorResponse = ErrorResponse.builder().status(409).message(ex.getMessage()).build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Map<String, Object> ViolationData(Exception ex) {
        response.put("status", 400);
        response.put("message", ex.getMessage());
        // response.put("message","No se detectan los parámetros ó tienen datos
        // incorrectos, favor de validar su información.");
        return response;
    }

    @ExceptionHandler(UnexpectedRollbackException.class)
    public ResponseEntity<ErrorResponse> violationSQL_multiple(Exception ex) {
        // ErrorResponse errorResponse = ErrorResponse.builder().status(409)
        // .message("Datos Incorrectos, violación de integridad en base, favor de
        // validar.").build();
        ErrorResponse errorResponse = ErrorResponse.builder().status(409).message(ex.getMessage()).build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDto> Invalid_Data(MethodArgumentNotValidException ex) {
        try {
            // // ErrorResponse errorResponse = ErrorResponse.builder().status(400)
            // // .message("Datos Incorrectos favor de validar.").build();
            // ErrorResponse errorResponse =
            // ErrorResponse.builder().status(400).message(ex.getMessage()).build();
            BindingResult bindingResult = ex.getBindingResult();
            StringJoiner errors = new StringJoiner("; ");

            bindingResult.getFieldErrors().forEach(error -> errors.add(error.getDefaultMessage()));
            return ResponseEntity.ok().body(responseDtoService.buildJsonErrorValidateResponse(errors.toString()));

            // return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(responseDtoService.buildJsonErrorResponse("Datos Incorrectos favor de validar."));
        }

    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> violacionData(Exception ex) {
        // ErrorResponse errorResponse = ErrorResponse.builder().status(409)
        // .message("Datos Incorrectos, violación de integridad en base, favor de
        // validar.").build();
        ErrorResponse errorResponse = ErrorResponse.builder().status(409).message(ex.getMessage()).build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(javax.validation.ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> violacionDataDos(Exception ex) {
        // ErrorResponse errorResponse = ErrorResponse.builder().status(409)
        // .message("Datos Incorrectos, violación de integridad en base, favor de
        // validar.").build();
        ErrorResponse errorResponse = ErrorResponse.builder().status(409).message(ex.getMessage()).build();
        return ResponseEntity.status(409).body(errorResponse);
    }

}
