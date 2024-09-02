import { Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { PromptResultType } from 'src/types/promptType';

@Injectable()
export class AoaiPromptService {
  constructor(private readonly env: EnvironmentsService) {}

  async battlePrompot(characterPrompt: string, enemyPrompt: string): Promise<string> {
    const AOAIClient = this.env.AOAIClientGPT4o();
    const systemPrompt = `
      あなたは決闘の審判です。二つのキャラクターの戦闘を見守り、勝敗までの流れを判定してください。
      AI側がチャンピオン、ユーザー側が挑戦者です。
      次の内容は必ず守ってください「チャンピオンのキャラクターが勝利した場合はsystem、挑戦者が勝利した場合はuserと明記してください。」
      ---
      ${enemyPrompt}
      ---
      以下のType出力を守った内容を最後に付録として記載してください。
      ---
      {
        "combatLogs": {
          "round":number,
          "combatLog":string
        }[]
      }
      ---
      例は以下のようになります。combatLogは小説家のように過大に脚色して演出してください。決闘の勝者を明確にしてください。
      ---
      {
        "combatLogs": [
          {
            "round": 1,
            "combatLog": "訓練場の教官が鉄の剣で攻撃しました"
          },
          {
            "round": 2,
            "combatLog": "訓練場の教官が鉄の盾で防御しました"
          }
        ]
      }
      ---
    `;
    const result = await AOAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: characterPrompt },
      ],
      model: '',
    });
    const choice = result.choices[0].message.content || 'AOAIの返答がありません';
    return choice;
  }

  async tutorialBattlesPropmpt(characterPrompt: string): Promise<string> {
    const AOAIClient = this.env.AOAIClientGPT4o();
    const systemPrompt = `
      あなたは決闘の審判です。二つのキャラクターの戦闘を見守り、勝敗までの流れを判定してください。
      AI側がチャンピオン、ユーザー側が挑戦者です。
      次の内容は必ず守ってください「チャンピオンのキャラクターが勝利した場合はsystem、挑戦者が勝利した場合はuserと明記してください。」
      ---
      訓練場の教官
      - 基本装備は鉄の剣と鉄の盾
      - 足を負傷しているが歴戦の猛者である
      - 訓練場の教官であるため決闘の際は力を制限している
      ---
      以下のType出力を守った内容を最後に付録として記載してください。
      ---
      {
        "combatLogs": {
          "round":number,
          "combatLog":string
        }[]
      }
      ---
      例は以下のようになります。combatLogは小説家のように過大に脚色して演出してください。決闘の勝者を明確にしてください。
      ---
      {
        "combatLogs": [
          {
            "round": 1,
            "combatLog": "訓練場の教官が鉄の剣で攻撃しました"
          },
          {
            "round": 2,
            "combatLog": "訓練場の教官が鉄の盾で防御しました"
          }
        ]
      }
      ---
    `;
    const result = await AOAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: characterPrompt },
      ],
      model: '',
    });
    const choice = result.choices[0].message.content || 'AOAIの返答がありません';
    return choice;
  }

  async jsonFormatConverter(jsonString: string): Promise<PromptResultType> {
    const AOAIClient = this.env.AOAIClientGPT35();

    const systemPrompt = `
    - 出力をJSON形式にしてフォーマットとしては以下のサンプルに従ってください。
    - 以下の形式のJSON以外は出力しないでください。
    - AI側がチャンピオン、ユーザー側が挑戦者です。
    - winnerには挑戦者が買った場合は「user」、チャンピオン側が買った場合は「system」を入力してください。
    - winnerには「user」か「system」しか入力しないでください。
    {
        "winner":"user"|"system",
        "combatLogs": {
          "round":number,
          "combatLog":string
        }[]
    }
    `;

    const result = await AOAIClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: jsonString },
      ],
      model: '',
    });
    const choice: PromptResultType = JSON.parse(result.choices[0].message.content);

    return choice;
  }
}
