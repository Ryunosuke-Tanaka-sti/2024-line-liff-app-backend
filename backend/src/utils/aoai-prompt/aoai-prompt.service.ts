import { Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { PromptResultType, PromptResultTypeSchema } from 'src/types/promptType';
import { zodResponseFormat } from 'openai/helpers/zod';

@Injectable()
export class AoaiPromptService {
  constructor(private readonly env: EnvironmentsService) {}

  async battlePrompot(characterPrompt: string, enemyPrompt: string): Promise<PromptResultType> {
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
    const response_format = zodResponseFormat(PromptResultTypeSchema, 'combat_schema');

    const result = await AOAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: characterPrompt },
      ],
      model: '',
      response_format: response_format,
    });
    const math_combat_schema = result.choices[0].message;
    if (math_combat_schema.refusal) {
      throw new Error('JSON整形を正しく行うことができませんでした。よって開発者の負けです。');
    }
    const choice: PromptResultType = JSON.parse(result.choices[0].message.content);
    console.log(choice);
    return choice;
  }
  // TEST:JSON作成モードの挙動確認用
  async battlePrompotFormatJSON_JsonSchema(): Promise<PromptResultType> {
    const AOAIClient = this.env.AOAIClientGPT4o();

    const systemPrompt = `
      あなたは決闘の審判です。二つのキャラクターの戦闘を見守り、勝敗までの流れを判定してください。
      AI側がチャンピオン、ユーザー側が挑戦者です。
      次の内容は必ず守ってください「チャンピオンのキャラクターが勝利した場合はsystem、挑戦者が勝利した場合はuserと明記してください。」
      ---
      ボクシングチャンピオン主にこぶしで戦う
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
        { role: 'user', content: '剣士 主に剣で戦う' },
      ],
      model: '',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'combat_schema',
          schema: {
            type: 'object',
            properties: {
              winer: {
                description:
                  '戦いの勝者を記述する。ユーザー側が勝利した場合は「user」、システム側が勝利した場合は「sysytem」を代入',
                type: 'string',
              },
              combatLogs: {
                description: '戦いの記録を記述する。roundには記録の順序を記述する。combatLogには記録の内容を記述する。',
                type: 'array',
                items: {
                  type: 'object',
                  required: ['round', 'combatLog'],
                  properties: {
                    round: { type: 'number' },
                    combatLog: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(result.choices[0].message.content);
    const choice: PromptResultType = JSON.parse(result.choices[0].message.content);
    return choice;
  }

  async battlePrompotFormatJSON_Zod(): Promise<PromptResultType> {
    const AOAIClient = this.env.AOAIClientGPT4o();

    const systemPrompt = `
      あなたは決闘の審判です。二つのキャラクターの戦闘を見守り、勝敗までの流れを判定してください。
      AI側がチャンピオン、ユーザー側が挑戦者です。
      次の内容は必ず守ってください「チャンピオンのキャラクターが勝利した場合はsystem、挑戦者が勝利した場合はuserと明記してください。」
      ---
      ボクシングチャンピオン主にこぶしで戦う
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
    const response_format = zodResponseFormat(PromptResultTypeSchema, 'combat_schema');
    const result = await AOAIClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: '剣士 主に剣で戦う' },
      ],
      model: '',
      response_format: response_format,
    });
    const math_combat_schema = result.choices[0].message;
    if (math_combat_schema.refusal) {
      return {
        winner: 'user',
        combatLogs: [
          {
            round: 1,
            combatLog: 'JSON整形を正しく行うことができませんでした。よって開発者の負けです。',
          },
          {
            round: 2,
            combatLog:
              '弊社の開発者が敗北しました。もし、デバックしてくれたのであれば会場にいるスタッフにこっそり教えてください。',
          },
        ],
      };
    }
    const choice: PromptResultType = JSON.parse(result.choices[0].message.content);
    console.log(choice);
    return choice;
  }

  async tutorialBattlesPropmpt(characterPrompt: string): Promise<string> {
    const AOAIClient = this.env.AOAIClientGPT4o();
    const systemPrompt = `
      あなたは決闘の審判です。二つのキャラクターの戦闘を見守り、勝敗までの流れを判定してください。
      AI側がチャンピオン、ユーザー側が挑戦者です。
      次の内容は必ず守ってください「チャンピオンのキャラクターが勝利した場合はsystem、挑戦者が勝利した場合はuserと明記してください。」
      決闘の勝者を明確にしてください。内容は小説のように過大に脚色して演出してください。
      ---
      訓練場の教官
      - 基本装備は鉄の剣と鉄の盾
      - 足を負傷しているが歴戦の猛者である
      - 訓練場の教官であるため決闘の際は力を制限している
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
