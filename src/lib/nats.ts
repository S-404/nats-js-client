import { connect, Empty, NatsConnection, StringCodec, Subscription } from 'nats';
import logger from './logger.ts';
import eventbus from './eventbus.ts';
import { NATS_MESSAGE_ADD, NATS_STATUS_CONNECTED } from '#app/events/constants.ts';

export type  Server = {
  host: string;
  port: number;
  token: string;
}

export type NatsIncomingPacket = {
  headers?: object;
  reply?: string;
  payload: string;
  timestamp?: number;
}

const codec = StringCodec();

export type NatsCommonRequest = {
  id?: string,
  subject: string,
  payload: string,
  options?: object
}

class NatsGateway {
  #conn: NatsConnection;
  #subscription: Subscription;
  #subscribers: { [subject: string]: string } = {}; // {[subject]: subjectId}

  async connect(config: Server) {
    const server = `${config?.host}${config?.port ? `:${config.port}` : ''}`;
    logger({ message: `Connecting to NATS server: ${server}`, type: 'warn' });
    try {
      this.#conn = await connect({
        servers: server,
        token: config?.token || '',
        reconnectTimeWait: 60 * 1000,
        reconnectJitter: 10 * 1000,
        maxReconnectAttempts: -1,
      });
      logger({ message: 'Connected', type: 'success' });
      eventbus.emit(NATS_STATUS_CONNECTED, true);
      await this.#subscribeIncoming();
    } catch (err) {
      this.#conn = undefined;
      eventbus.emit(NATS_STATUS_CONNECTED, false);
      logger({ message: `Failed to connect: ${err.message}`, type: 'error' });
      console.error('err', err.message);
    }
  }

  async disconnect() {
    if (this.#conn) {
      logger({ message: 'Disconnecting from server...', type: 'warn' });
      await this.#conn?.drain();
      await this.#conn?.close();
      this.#conn = undefined;
      this.#subscription.unsubscribe();
      this.#subscription = undefined;
      this.#subscribers = {};
      logger({ message: 'Disconnected...', type: 'success' });
    }
    eventbus.emit(NATS_STATUS_CONNECTED, false);
  }

  async publish({ subject, payload, options }: NatsCommonRequest) {
    try {
      this.#conn.publish(
        subject,
        (payload && codec.encode(payload)) || Empty,
        options
      );
      logger({ message: `Publish '${subject}' success`, type: 'success' });
    } catch (e) {
      logger({ message: `Publish '${subject}' is failed: ${e.message}`, type: 'error' });
    }
  }

  async request({ subject, payload, options, id }: NatsCommonRequest) {
    logger({ message: `Requesting '${subject}'...`, type: 'warn' });

    try {
      const response = await this.#conn.request(
        subject,
        (payload && codec.encode(payload)) || Empty,
        {
          timeout: 5 * 1000,
          ...options,
        },
      );
      const decoded = codec.decode(response.data);

      eventbus.emit(NATS_MESSAGE_ADD, {
        subjectId: id,
        packet: {
          payload: decoded,
          timestamp: ~~(new Date().getTime() / 1000)
        },
        type: 'response',
      });

      logger({ message: `Request '${subject}' is success`, type: 'success' });

      return decoded;
    } catch (e) {
      logger({ message: `Request '${subject}' is failed: ${e.message}`, type: 'error' });
    }
  }

  async subscribe({ subject, id }: Pick<NatsCommonRequest, 'subject' | 'id'>) {
    this.#subscribers[subject] = id;
    logger({ message: `Subject subscribed ${subject}`, type: 'warn' });
  }

  async unsubscribe({ subject }: Pick<NatsCommonRequest, 'subject'>) {
    delete this.#subscribers[subject];
    logger({ message: `Unsubscribed subject ${subject}`, type: 'warn' });
  }

  async #subscribeIncoming() {
    this.#subscription = this.#conn.subscribe('>');
    logger({ message: `Subscribed for subject '${this.#subscription.getSubject()}'`, type: 'info' });
    for await (const incoming of this.#subscription) {
      if (!incoming.subject.startsWith('_INBOX.')) {
        const subjectId = this.#subscribers[incoming.subject];
        if (subjectId) {
          const decoded = codec.decode(incoming.data);
          logger({
            message: `Publication with subscribed subject '${incoming.subject}'`,
            type: 'success',
            subject: incoming.subject,
          });
          eventbus.emit(NATS_MESSAGE_ADD, {
            subjectId,
            packet: {
              payload: decoded,
              timestamp: ~~(new Date().getTime() / 1000)
            },
            type: 'response',
          });
        } else {
          logger({
            message: `Publication with subject '${incoming.subject}'`,
            type: 'info',
            subject: incoming.subject,
          });
        }
      }
    }
  }
}

export default new NatsGateway();
