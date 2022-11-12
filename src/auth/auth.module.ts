import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/service/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60000s',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
