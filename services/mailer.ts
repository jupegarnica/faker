import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { logger } from "./logger.ts";

const config = {
  get hostname() {
    return Deno.env.get("SMTP_HOST") || "";
  },
  get port() {
    return Number(Deno.env.get("SMTP_PORT")) || 1025;
  },
  get username() {
    return Deno.env.get("SMTP_USERNAME") || "";
  },
  get password() {
    return Deno.env.get("SMTP_PASSWORD") || "";
  },
  get from() {
    return Deno.env.get("SMTP_FROM") || "";
  },
  get to() {
    return Deno.env.get("SMTP_TO") || "";
  },
};

const client = new SmtpClient();
interface Email {
  from: string;
  to: string;
  subject: string;
  content: string;
}

const queue: Email[] = [];
function layout(content: string) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
        .html, body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        .record {
          padding: 1em;
        }
        .ERROR {
          color: red;
        }
        .args {
          opacity:0.8;
          padding-left:1em;
          font-size:0.8em;
        }
        .arg0 {
          opacity:1;
          font-size:1.2em;
        }
        </style>
    </head>
    <body>
    ${content}
    </body>
    </html>`;
}
export function addLogToQueue(
  { from = config.from, to = config.to, subject, content }: Partial<Email>,
): void {
  queue.push({
    from,
    to,
    subject,
    content,
  });
}

export async function flushQueue(): Promise<void> {
  try {
    try {
      await client.connectTLS({
        hostname: config.hostname,
        port: Number(config.port),
        username: config.username,
        password: config.password,
      });
    } catch (error) {
      await client.connect({
        hostname: config.hostname,
        port: Number(config.port),
        username: config.username,
        password: config.password,
      });
    }
    let content = "";
    let from = "";
    let to = "";
    let subject = "";
    for (const email of queue) {
      const data: any = email;
      content += `${data.content}\n`;
      from = email.from;
      to = email.to;
      subject = email.subject;
    }
    if (content) {
      await sendEmail({ to, from, subject, content });
    }
    queue.length = 0;
    await client.close();
  } catch (error) {
    logger.error("Error sending email", error);
  }
}

export async function sendEmail({ from, to, subject, content }: Email) {
  await client.send({
    from,
    to,
    subject,
    content: layout(content),
  });
  logger.debug(`Email with subject ${subject} sent to ${to}`);
}
