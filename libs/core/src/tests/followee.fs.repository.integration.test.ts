import { join } from "path";
import { writeFile, readFile } from "fs/promises";
import { FileSystemFolloweeRepository } from "../infra/followee.fs.repository";

const testFolloweesPath = join(__dirname, "test-followees.json");

describe("File System Followee repository", () => {
  beforeEach(async () => {
    await writeFile(testFolloweesPath, JSON.stringify({}));
  });

  test("should save a followee", async () => {
    const followeeRepository = new FileSystemFolloweeRepository(
      testFolloweesPath,
    );

    await writeFile(
      testFolloweesPath,
      JSON.stringify({ Alice: ["Bob"], Bob: ["Charlie"] }),
    );

    await followeeRepository.saveFollowee({
      user: "Alice",
      followee: "Charlie",
    });

    const followeesData = await readFile(testFolloweesPath);
    const followeesJSON = JSON.parse(followeesData.toString()) as Record<
      string,
      string[]
    >;
    expect(followeesJSON).toEqual({
      Alice: ["Bob", "Charlie"],
      Bob: ["Charlie"],
    });
  });

  test("should save a followee when there was not any followees", async () => {
    const followeeRepository = new FileSystemFolloweeRepository(
      testFolloweesPath,
    );

    await writeFile(testFolloweesPath, JSON.stringify({ Bob: ["Charlie"] }));

    await followeeRepository.saveFollowee({
      user: "Alice",
      followee: "Charlie",
    });

    const followeesData = await readFile(testFolloweesPath);
    const followeesJSON = JSON.parse(followeesData.toString()) as Record<
      string,
      string[]
    >;
    expect(followeesJSON).toEqual({
      Alice: ["Charlie"],
      Bob: ["Charlie"],
    });
  });

  test("should get followees of user", async () => {
    const followeeRepository = new FileSystemFolloweeRepository(
      testFolloweesPath,
    );

    await writeFile(
      testFolloweesPath,
      JSON.stringify({ Alice: ["Bob"], Bob: ["Charlie"] }),
    );

    const followees = await followeeRepository.getFolloweesOfUser("Alice");

    expect(followees).toEqual(["Bob"]);
  });

  test("should get followees of user when there are no followees", async () => {
    const followeeRepository = new FileSystemFolloweeRepository(
      testFolloweesPath,
    );

    await writeFile(
      testFolloweesPath,
      JSON.stringify({ Bob: ["Charlie"], Baba: ["Ronaldo", "Lebron"] }),
    );

    const followees = await followeeRepository.getFolloweesOfUser("Alice");

    expect(followees).toEqual([]);
  });
});
