import { N8N_WEBHOOK_URL } from '../constants';
import { N8NPayload } from '../types';

export const triggerN8nWorkflow = async (payload: N8NPayload): Promise<boolean> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error triggering N8N:', error);
    return false;
  }
};
