This project has two versions, you're currently in the `NestJS` version.
You can find the `Fastify` version in the [main](https://github.com/ymeskini/social-networking-kata) branch.

In this version we're benefiting from the NestJS ecosystem, where we built a monorepo with the following structure:
- `libs/core`: Contains the core business logic and domain entities.
- `apps`: Contains the application-specific code, such as controllers and services. We have the API and the CLI.

Thanks to the Dependency Injection (DI) system of NestJS, we can easily share the core logic across different applications.

```shell
cd libs/core/src/infra/prisma
npx prisma generate
```
