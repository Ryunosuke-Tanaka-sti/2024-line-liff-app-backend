import { z } from 'zod';

export class PromptResultType {
  winner: 'user' | 'system';
  combatLogs: {
    round: number;
    combatLog: string;
  }[];
}

export const PromptResultTypeSchemaZod = z.object({
  winner: z
    .enum(['user', 'system'])
    .describe('戦いの勝者を記述する。ユーザー側が勝利した場合は「user」、システム側が勝利した場合は「sysytem」を代入'),
  combatLogs: z.array(
    z.object({
      round: z.number().describe('戦いの記録の順序を記述する。'),
      combatLog: z.string().describe('戦いの記録の内容を記述する。'),
    }),
  ),
});

export type PromptResultTypeFromZod = z.infer<typeof PromptResultTypeSchemaZod>;
