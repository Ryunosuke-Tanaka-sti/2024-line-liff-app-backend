import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class TokenDecodeService {
  constructor(private readonly enviromentService: EnvironmentsService) {}
  async decodeIdToken(idToken: string): Promise<string> {
    try {
      const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id_token=${idToken}&client_id=${this.enviromentService.ChannelID}`,
      });
      const data = (await response.json())['sub'];
      return data;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
