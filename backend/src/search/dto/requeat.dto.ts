import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UtilityFilter {
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((value) => value),
  )
  ids?: string[];
}
