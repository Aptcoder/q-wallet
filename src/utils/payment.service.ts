/* eslint-disable camelcase */
import axios from 'axios';
import forge from 'node-forge';
import config from 'config';
// type paymentProvider = 'FLUTTERWAVE'

type statusType = 'success' |'error'

const processPaymentServErrorr = (err: any) => {
  let status: statusType = 'error';
  let data = {};
  let { message } = err;
  if (err.response) {
    data = err.response.data;
    message = err.response.message;
    status = err.response.status;
  }

  return {
    status,
    data,
    message
  };
};

interface ResponseData {
  status: statusType,
  message: string,
  data: Record<string, string | object | number >,
  meta?: Record<string, string | object | number >,
}
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

  public async initiateCardPayment(payload: { tx_ref: string,
      amount: number,
      card_number: string,
      cvv: string,
      expiry_month: string,
      expiry_year: string,
      email?: string,
      pin?: string,
      fullname?: string }): Promise<ResponseData> {
    const fw_payload = {
      ...payload,
      currency: 'NGN',
      amount: String(payload.amount),
      authorization: {}
    };

    if (payload.pin) {
      fw_payload.authorization = {
        mode: 'pin',
        pin: payload.pin
      };
    }

    const encrypted_payload = this.encryptPayload(JSON.stringify(fw_payload));
    const response = await this.client.post('/charges?type=card', {
      client: encrypted_payload
    });
    return response.data;
  }

  public async validateCharge(flw_ref: string, otp: string, charge_type = 'card'): Promise<ResponseData> {
    try {
      const result = await this.client.post('/validate-charge', {
        otp,
        flw_ref,
        type: charge_type
      });
      console.log('res', result.data);
      return result.data;
    } catch (err) {
      return processPaymentServErrorr(err);
    }
  }
}

export default new PaymentService(config.get('flw_secret'), config.get('flw_encryption_key'));
