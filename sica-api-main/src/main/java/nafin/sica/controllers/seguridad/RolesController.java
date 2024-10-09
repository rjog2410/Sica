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
import nafin.sica.persistence.dto.ValidationsDto.RolDeleteAllDto;
import nafin.sica.persistence.dto.ValidationsDto.RolDeleteDto;
import nafin.sica.persistence.dto.ValidationsDto.RolRequestDto;
import nafin.sica.persistence.dto.ValidationsDto.RolUpdateDto;
import nafin.sica.persistence.repositories.RoleRepository;
import nafin.sica.service.ResponseDtoService;
import nafin.sica.service.RolesService;
import nafin.sica.service.Utils;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = { RequestMethod.POST })
public class RolesController {
    @Autowired
    ResponseDtoService responseDtoService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    Utils utils;

    @Autowired
    RolesService rolesService;

    @PostMapping("/seguridad/roles/create")
    public ResponseEntity<ResponseDto> create(@RequestBody @Valid RolRequestDto rolRequestDto) {
        ResponseDto response = rolesService.createRol(rolRequestDto);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/roles/update")
    public ResponseEntity<ResponseDto> update(@RequestBody @Valid RolUpdateDto rolUpdateDto) {
        ResponseDto response = rolesService.updateRol(rolUpdateDto);
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/roles/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid RolDeleteDto rolDeleteDto) {
        ResponseDto response = rolesService.delete_rol(rolDeleteDto);
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/seguridad/roles/delete_all")
    public ResponseEntity<ResponseDto> delete(@RequestBody @Valid RolDeleteAllDto rolDeleteAllDto) {
        ResponseDto response = rolesService.delete_rol_all(rolDeleteAllDto);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/seguridad/roles/get")
    public ResponseEntity<ResponseDto> get_roles() {
        return ResponseEntity.ok().body(rolesService.get_roles());
    }

}
