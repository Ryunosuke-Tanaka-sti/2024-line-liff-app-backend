import { Injectable } from '@nestjs/common';

import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class DocsAccessService {
  constructor(private readonly env: EnvironmentsService) {}
  docs = this.env.googleDosc;

  async getDoc(docId: string) {
    try {
      const response = await this.docs.documents.get({
        documentId: docId,
      });
      return response.data.body;
    } catch (error) {
      console.log('catch error in getDoc');
      console.error('Error fetching document:', error);
      throw error;
    }
  }
  async updateDoc(docId: string, text: string) {
    try {
      const response = await this.docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              insertText: {
                text: text,
                location: {
                  index: 1, // Insert at the beginning of the document
                },
              },
            },
          ],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }
}
