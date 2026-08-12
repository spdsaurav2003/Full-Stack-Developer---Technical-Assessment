import { IsString, IsOptional, MaxLength } from 'class-validator';

export class GuestLoginDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}
