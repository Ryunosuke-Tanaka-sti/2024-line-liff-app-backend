export class PromptResultType {
  winner: 'user' | 'system';
  combatLogs: {
    round: number;
    combatLog: string;
  }[];
}
