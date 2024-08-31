import { Injectable } from '@nestjs/common';

import { EnvironmentsService } from './config/enviroments.service';
@Injectable()
export class AppService {
  constructor(private readonly env: EnvironmentsService) {}
  async getHello(): Promise<string> {
    const client = this.env.AOAIClientGPT4o();
    const result = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Does Azure OpenAI support customer managed keys?' },
        { role: 'assistant', content: 'Yes, customer managed keys are supported by Azure OpenAI?' },
        { role: 'user', content: 'Do other Azure AI services support this too?' },
      ],
      model: '',
    });

    for (const choice of result.choices) {
      // console.log(choice.message);
      console.log(choice.message.content);
    }

    return `Hello World!!!!!!`;
  }
}
