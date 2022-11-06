import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  findAll(): Observable<Partial<User>[]> {
    return from(this.usersRepository.find()).pipe(
      map((users) => {
        const updateUser = users.map((v) => {
          const { password, ...user } = v;
          return {
            ...user,
          };
        });
        return updateUser;
      }),
    );
  }

  findOne(id: number): Observable<Partial<User>> {
    return from(this.usersRepository.findOneBy({ id })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  create(user: User): Observable<Partial<User>> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();

        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.usersRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
        );
      }),
    );
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this.usersRepository.delete({ id }));
  }

  updateOne(id: number, user: Partial<User>): Observable<UpdateResult> {
    delete user.email;
    delete user.password;
    return from(this.usersRepository.update(id, user));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJwt(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong Credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<Partial<User>> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByMail(email: string): Observable<User | null> {
    return from(
      this.usersRepository.findOne({
        where: {
          email: email,
        },
      }),
    );
  }
}
