package nafin.sica.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import nafin.sica.persistence.entity.UserEntity;
import nafin.sica.persistence.repositories.UserRepository;

@Service
public class UserDetailServiceImpl implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        UserEntity usuario = userRepository.findUserEntityByUsername(username).orElseThrow(()-> new UsernameNotFoundException("El usuario " + " no existe.")) ;
        String password = "password";
        List<String> authorities = new ArrayList<>();
        authorities.add("ROLE_USER");
        return new User(usuario.getUsername(),
                password,
                true,
                true,
                true,
                true,
                authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
    }
}
