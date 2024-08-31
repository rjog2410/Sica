package nafin.sica.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class ColumnasService {
    @Autowired
    Utils utils;

    String sistema;
    String modulo;
    Integer columna;

}
