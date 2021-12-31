/* eslint-disable camelcase */
import axios from 'axios';
import forge from 'node-forge';
import config from 'config';
// type paymentProvider = 'FLUTTERWAVE'

class PaymentService {
  private client;

  private SECRET_KEY;

  private ENCRYPTION_KEY;

  constructor(SECRET_KEY: string, ENCRYPTION_KEY: string) {
    if (!SECRET_KEY) {
      throw new Error('API key is required by payment service');
    }
    if (!ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION key is required by payment service');
    }
    this.SECRET_KEY = SECRET_KEY;
    this.ENCRYPTION_KEY = ENCRYPTION_KEY;
    this.client = axios.create({
      baseURL: 'https://api.flutterwave.com/v3/',
      headers: {
        Authorization: `Bearer ${this.SECRET_KEY}`
      }
    });
  }

  private encryptPayload(payload: string) {
    console.log('pay', payload);
    const cipher = forge.cipher.createCipher(
      '3DES-ECB',
      forge.util.createBuffer(this.ENCRYPTION_KEY)
    );

    cipher.start({ iv: '' });
    cipher.update(forge.util.createBuffer(payload, 'utf8'));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }

  // eslint-disable-next-line no-dupe-args
  public async initiateCardPayment(payload: { tx_ref: string,
      amount: number,
      card_number: string,
      cvv: string,
      expiry_month: string,
      expiry_year: string,
      email?: string,
      fullname?: string }) {
    const fw_payload = {
      ...payload,
      currency: 'NGN',
      amount: String(payload.amount)
    };

    const encrypted_payload = this.encryptPayload(JSON.stringify(fw_payload));
    console.log('encr', encrypted_payload);
    const response = await this.client.post('/charges?type=card', {
      client: encrypted_payload
    });
    // console.log('result', response);
    return response.data;
  }
}

export default new PaymentService(config.get('flw_secret'), config.get('flw_encryption_key'));
