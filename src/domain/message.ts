import { UUID } from 'crypto';

export class MessageTooLongError extends Error {
  constructor() {
    super('Message cannot be longer than 280 characters');
    super.name = 'MessageTooLongError';
  }
}
export class EmptyMessageError extends Error {
  constructor() {
    super('Message cannot be empty');
    super.name = 'EmptyMessageError';
  }
}

export class Message {
  constructor(
    private readonly _id: UUID,
    private _text: MessageText,
    private readonly _author: string,
    private readonly _publishedAt: Date,
  ) {}

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get publishedAt() {
    return this._publishedAt;
  }

  get text() {
    return this._text.value;
  }

  editText(text: string) {
    this._text = MessageText.of(text);
  }

  // serialize
  get data() {
    return {
      id: this.id,
      author: this.author,
      text: this._text.value,
      publishedAt: this.publishedAt.toISOString(),
    };
  }

  // deserialize
  static fromData(data: Message['data']) {
    return new Message(
      data.id,
      MessageText.of(data.text),
      data.author,
      new Date(data.publishedAt),
    );
  }
}

export class MessageText {
  private constructor(readonly value: string) {}

  static of(value: string) {
    if (value.length > 280) {
      throw new MessageTooLongError();
    }

    if (value.trim().length === 0) {
      throw new EmptyMessageError();
    }

    return new MessageText(value);
  }
}
