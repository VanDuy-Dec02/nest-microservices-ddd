import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async init() {
    this.connection = await amqp.connect(
      this.configService.get<string>("RABBITMQ_URL") ?? "amqp://localhost:5672"
    );
    this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any) {
    await this.channel.assertQueue(queue);
    return this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message))
    );
  }

  async subscribe(queue: string, callback: (message: any) => void) {
    await this.channel.assertQueue(queue);
    return this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(JSON.parse(msg.content.toString()));
        this.channel.ack(msg);
      }
    });
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }
}
