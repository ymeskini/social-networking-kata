import { BaseDateProvider } from "../application/date.provider";

describe("DateProvider", () => {
  let dateProvider: BaseDateProvider;

  beforeEach(() => {
    dateProvider = new BaseDateProvider();
  });

  describe("formatRelative", () => {
    it('should return "less than a minute ago" when the message was published less than a minute ago', () => {
      const now = new Date("2021-01-01T16:31:00Z");
      const publishedAt = new Date("2021-01-01T16:30:30Z");
      const text = dateProvider.formatRelative(publishedAt, now);

      expect(text).toBe("less than a minute ago");
    });

    it('should return "1 minute ago" when the message was published 1 minute ago', () => {
      const now = new Date("2021-01-01T16:31:00Z");
      const publishedAt = new Date("2021-01-01T16:30:00Z");
      const text = dateProvider.formatRelative(publishedAt, now);

      expect(text).toBe("1 minute ago");
    });

    it('should return "X minutes ago" when the message was published more than 2 minutes ago', () => {
      const now = new Date("2021-01-01T16:31:00Z");
      const publishedAt = new Date("2021-01-01T16:28:00Z");
      const text = dateProvider.formatRelative(publishedAt, now);

      expect(text).toBe("3 minutes ago");
    });
  });
});
