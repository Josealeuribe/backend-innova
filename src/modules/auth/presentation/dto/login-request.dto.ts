import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginRequestDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail(
    {},
    {
      message: 'El correo no tiene un formato válido.',
    },
  )
  @MaxLength(191)
  correo: string;

  @IsString()
  @IsNotEmpty({
    message: 'La contraseña es obligatoria.',
  })
  @MaxLength(100)
  contrasena: string;
}
