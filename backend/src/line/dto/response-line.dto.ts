import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { todoType } from 'src/types/todoType';

export class ResponseLineTodoGetDto {
  @ValidateNested({ each: true })
  @Type(() => todoType)
  todos: todoType[];
}
