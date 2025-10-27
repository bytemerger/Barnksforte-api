import nodemailer from 'nodemailer';
import Logger from '../common/logger';
import { getEnvOrThrow } from './util';
import { IPost } from '../models/post';

class Mail {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      url: getEnvOrThrow('MAIL_SMTP_URL'),
    });
  }

  private async sendEmail(
    recipients: string[], 
    data: Record<string, unknown>, 
    bcc: string[] = [], 
    from?: { name: string, address: string }
  ) {
    if (getEnvOrThrow('NODE_ENV') !== 'production') {
      this.logger.info(`Email sent to ${recipients} and data ${JSON.stringify(data)}`);
      return;
    }

    const sender = from ? from : { name: getEnvOrThrow('MAIL_DEFAULT_SENDER_NAME'), address: getEnvOrThrow('MAIL_DEFAULT_SENDER') };
    
    this.logger.info(`Sending an email with [${data}] to [${recipients}]`);

    //TODO: use a template engine to process the html
    const htmlToSend = `<h1>Hello</h1>`;
    
    const info = await this.transporter.sendMail({
      from: {
        name: data.accountName as string,
        address: sender.address
      },
      bcc: bcc,
      to: recipients,
      subject: data.subject as string,
      html: htmlToSend,
    });

    return info.messageId;
  }

  async sendSharedPostEmail(emails: string[], post: IPost) {
    const recipients = emails;
    const data = {
      accountName: 'Barnksforte',
      subject: 'Shared Post',
      post: {
        content: post.content,
        author: post.author,
      }
    };

    await this.sendEmail(recipients, data);
  }
}

export default new Mail();