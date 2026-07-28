package com.phishshield.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService; private final CustomUserDetailsService userDetailsService;
    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String header=request.getHeader("Authorization"); if(header==null||!header.startsWith("Bearer ")){chain.doFilter(request,response);return;} String token=header.substring(7);
        try { String email=jwtService.extractEmail(token); if(SecurityContextHolder.getContext().getAuthentication()==null){UserDetails user=userDetailsService.loadUserByUsername(email); if(jwtService.isValid(token, ((UserPrincipal) user).user())){var auth=new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));SecurityContextHolder.getContext().setAuthentication(auth);}} } catch(RuntimeException ignored) { }
        chain.doFilter(request,response);
    }
}
