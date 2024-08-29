package nafin.sica.service;


import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import nafin.sica.persistence.repositories.SesionRepository;

@Service
@AllArgsConstructor
public class SesionService {
    @Autowired
    private final SesionRepository sesionRepository;

    @Transactional
    public Integer closeSesion() {
        try {
            // SesionEntity closeSesion = sesionRepository.closeSesion();
            LocalDateTime date_logout = LocalDateTime.now();
            LocalDateTime date_login = LocalDateTime.now().minusMinutes(30);
            System.out.println("login - "+date_login);
            System.out.println("logout - " + date_logout);
            //Integer update = sesionRepository.closeSesion(date_logout, date_login);
            return 1;
        } catch (Exception e) {
            return 0;
        }

    }

    

}
