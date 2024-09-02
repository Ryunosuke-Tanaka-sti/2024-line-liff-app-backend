export class RequestUserIDDto {
  userID: string;
}

export class RequestBattleDto {
  userID: string;
  enemyID: string;
  name: string;
  prompt: string;
}
