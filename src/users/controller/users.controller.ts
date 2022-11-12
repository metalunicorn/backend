import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../models/user.interface';
import { UsersService } from '../service/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { hasRoles } from '../../auth/decorator/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../models/user.entity';
import { Paginator } from '../paginate';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() user: User): Observable<Partial<User> | unknown> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((error) => of({ error: error.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<unknown> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Request() request: any): Observable<Paginator<User>> {
    console.log(request.query);
    return this.userService.paginate({
      limit: request?.query?.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request?.query?.hasOwnProperty('page') ? request?.query?.page : 0,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<Partial<User | null>> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.delete(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateOne(id, user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/roles')
  updateRole(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateOne(id, user);
  }
}
