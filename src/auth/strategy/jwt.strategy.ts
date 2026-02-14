import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadDto } from "./dto/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['SECRET_KEY'] as string
    })
  }

  async validate(payload: PayloadDto) {
    return { userId: payload.sub, email: payload.email, name: payload.name }
  }
}
