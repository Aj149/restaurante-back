import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
  // Configura la estrategia JWT para extraer el token de la cabecera Authorization tipo Bearer
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Obtener token desde "Authorization: Bearer <token>"
    ignoreExpiration: false,  // No ignorar la expiración del token (token expirado será rechazado)
    secretOrKey: 'secreto-ultra-seguro',  // Clave secreta para verificar la firma del token JWT
  });
}

async validate(payload: any) {
  // Método que valida el payload del token decodificado
  // Aquí puedes devolver información relevante del usuario para que esté disponible en la solicitud (request)
  return { userId: payload.sub, email: payload.email };
}

}
