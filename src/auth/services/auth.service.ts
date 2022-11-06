import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { User } from 'src/users/models/user.interface';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(payload: User): Observable<string> {
    console.log('payload', payload);
    return from(this.jwtService.signAsync({ user: payload }));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(newPassword, passwordHash));
  }
}
