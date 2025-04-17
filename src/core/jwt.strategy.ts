import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secreto-ultra-seguro', // mismo secreto del paso anterior
    });
  }

  async validate(payload: any) {
    // Aquí puedes devolver info del usuario o simplemente el id
    return { userId: payload.sub, email: payload.email };
  }
}
