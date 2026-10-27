import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EnsureUserDto {
  @IsString()
  readonly name!: string;

  @IsEmail()
  readonly email!: string;

  @IsOptional()
  @IsString()
  readonly picture?: string | null;
}
