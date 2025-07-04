// SMS Service for sending real-time messages
export interface SMSMessage {
  to: string;
  message: string;
  from?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export interface SMSProvider {
  name: string;
  costPerSMS: number;
  maxLength: number;
  supportedCountries: string[];
}

// Available SMS providers
export const SMS_PROVIDERS: Record<string, SMSProvider> = {
  twilio: {
    name: 'Twilio',
    costPerSMS: 1.5, // KES
    maxLength: 160,
    supportedCountries: ['KE', 'UG', 'TZ', 'RW']
  },
  africastalking: {
    name: 'Africa\'s Talking',
    costPerSMS: 1.2, // KES
    maxLength: 160,
    supportedCountries: ['KE', 'UG', 'TZ', 'RW', 'GH', 'NG']
  },
  textmagic: {
    name: 'TextMagic',
    costPerSMS: 2.0, // KES
    maxLength: 160,
    supportedCountries: ['KE', 'UG', 'TZ', 'RW', 'ZA']
  }
};

class SMSService {
  private provider: string = 'africastalking'; // Default provider
  private apiKey: string = '';
  private senderId: string = 'SALON';

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = import.meta.env.VITE_SMS_API_KEY || 'demo_key';
    this.senderId = import.meta.env.VITE_SMS_SENDER_ID || 'SALON';
  }

  setProvider(provider: string) {
    if (SMS_PROVIDERS[provider]) {
      this.provider = provider;
    }
  }

  getProvider(): SMSProvider {
    return SMS_PROVIDERS[this.provider];
  }

  validatePhoneNumber(phone: string): boolean {
    // Kenyan phone number validation
    const kenyanPhoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
    return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''));
  }

  formatPhoneNumber(phone: string): string {
    // Convert to international format
    let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '+254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+254')) {
      cleaned = '+254' + cleaned;
    }
    
    return cleaned;
  }

  calculateCost(recipients: number, messageLength: number = 160): number {
    const provider = this.getProvider();
    const smsCount = Math.ceil(messageLength / provider.maxLength);
    return recipients * smsCount * provider.costPerSMS;
  }

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      // Validate phone number
      if (!this.validatePhoneNumber(message.to)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      const formattedPhone = this.formatPhoneNumber(message.to);
      const provider = this.getProvider();

      // Simulate API call based on provider
      const response = await this.callProviderAPI({
        ...message,
        to: formattedPhone
      });

      return response;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async sendBulkSMS(recipients: string[], message: string): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];
    
    // Send messages in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(phone => 
        this.sendSMS({ to: phone, message })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  private async callProviderAPI(message: SMSMessage): Promise<SMSResponse> {
    // Simulate different provider APIs
    switch (this.provider) {
      case 'twilio':
        return this.simulateTwilioAPI(message);
      case 'africastalking':
        return this.simulateAfricasTalkingAPI(message);
      case 'textmagic':
        return this.simulateTextMagicAPI(message);
      default:
        throw new Error('Unsupported SMS provider');
    }
  }

  private async simulateTwilioAPI(message: SMSMessage): Promise<SMSResponse> {
    // Simulate Twilio API call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      return {
        success: true,
        messageId: `tw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: this.calculateCost(1, message.message.length)
      };
    } else {
      return {
        success: false,
        error: 'Message delivery failed'
      };
    }
  }

  private async simulateAfricasTalkingAPI(message: SMSMessage): Promise<SMSResponse> {
    // Simulate Africa's Talking API call
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    // Simulate 97% success rate (better for African markets)
    if (Math.random() < 0.97) {
      return {
        success: true,
        messageId: `at_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: this.calculateCost(1, message.message.length)
      };
    } else {
      return {
        success: false,
        error: 'Network error or invalid recipient'
      };
    }
  }

  private async simulateTextMagicAPI(message: SMSMessage): Promise<SMSResponse> {
    // Simulate TextMagic API call
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800));
    
    // Simulate 93% success rate
    if (Math.random() < 0.93) {
      return {
        success: true,
        messageId: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cost: this.calculateCost(1, message.message.length)
      };
    } else {
      return {
        success: false,
        error: 'Message rejected by carrier'
      };
    }
  }

  // Template management
  getMessageTemplates() {
    return {
      welcome: 'Welcome to {shopName}! Thank you for joining our loyalty program. Enjoy your visit!',
      promotion: 'Special offer at {shopName}! Get {discount}% off your next visit. Book now: {phone}',
      reward: 'Congratulations {customerName}! You\'ve earned a free service at {shopName}. Visit us to redeem!',
      reminder: 'Hi {customerName}, we miss you at {shopName}! It\'s been a while since your last visit. Book today!',
      appointment: 'Hi {customerName}, your appointment at {shopName} is confirmed for {date} at {time}.',
      followup: 'Thank you for visiting {shopName}, {customerName}! How was your experience? Reply with your feedback.'
    };
  }

  processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return processed;
  }
}

export const smsService = new SMSService();