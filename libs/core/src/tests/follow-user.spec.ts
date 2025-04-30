import {
  FollowUserFixture,
  createFollowUserFixture,
} from './following.fixture';

describe('Feature: Following a user', () => {
  let fixture: FollowUserFixture;
  beforeEach(() => {
    fixture = createFollowUserFixture();
  });

  test('Alice can follow Bob', async () => {
    fixture.givenUserFollowees({
      user: 'Alice',
      followees: ['Charlie'],
    });

    fixture.whenUserFollowsAnotherUser({
      user: 'Alice',
      userToFollow: 'Bob',
    });

    await fixture.thenUserFolloweesShouldBe({
      user: 'Alice',
      followees: ['Charlie', 'Bob'],
    });
  });
});
