package nafin.sica.controllers.seguridad;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import nafin.sica.persistence.dto.ResponseDto;
import nafin.sica.persistence.dto.ValidationsDto.DeleteIdDto;
import nafin.sica.persistence.dto.ValidationsDto.RequestUserDto;
import nafin.sica.persistence.dto.ValidationsDto.UserDeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.UserPantallaDto;
import nafin.sica.persistence.repositories.UserRepository;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.ResponseService;
import nafin.sica.service.UserService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class UserController {

    @Autowired
    ResponseService responseService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    Utils utils;

    @Autowired
    UserService userService;

    @PostMapping("/seguridad/usuarios/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid RequestUserDto user) {
        return ResponseEntity.ok().body(userService.create(user));
    }

    @PostMapping("/seguridad/usuarios/get")
    public ResponseEntity<ResponseDto> get() {
        return ResponseEntity.ok().body(userService.get_All_Users());
    }

    @PostMapping("/seguridad/usuarios/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid RequestUserDto user) {
        return ResponseEntity.ok().body(userService.updateUser(user));
    }

    @Transactional
    @PostMapping("/seguridad/usuarios/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid DeleteIdDto userDeleteDto) {
        return ResponseEntity.ok().body(userService.delete(userDeleteDto));
    }

    @Transactional
    @PostMapping("/seguridad/usuarios/delete_all")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid UserDeleteAllDto userDeleteAllDto) {
        return ResponseEntity.ok().body(userService.delete_all(userDeleteAllDto));
    }

    @Transactional
    @PostMapping("/seguridad/usuarios/assign_permissions")
    public ResponseEntity<ResponseDto> assing_permissions(@RequestBody @Valid UserPantallaDto userPantallaDto) {
        return ResponseEntity.ok().body(userService.create_pantallas(userPantallaDto));
    }

    @PostMapping("/seguridad/usuarios/get_permissions")
    public ResponseEntity<ResponseDto> get_permissions(@RequestBody @Valid DeleteIdDto user) {
        return ResponseEntity.ok().body(userService.get_permissions(user));
    }

}
