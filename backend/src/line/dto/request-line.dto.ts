export class RequestUserIDDto {
  userID: string;
}

export class RequestBattleDto {
  userID: string;
  enemyID: string;
  name: string;
  prompt: string;
}

export class RequestCreateEnemyDto {
  name: string;
  prompt: string;
  originalContentUrl: string;
  previewImageUrl: string;
}
