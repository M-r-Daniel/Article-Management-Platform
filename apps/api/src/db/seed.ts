import { generateSlug } from '@article-platform/shared';
import { db } from './index';
import { articles } from './schema';

const sampleArticles = [
  {
    title: 'Getting Started with Bun and Hono',
    summary:
      'A comprehensive guide on building ultra-fast APIs using Hono framework and Bun runtime.',
    content:
      'Bun is a fast, all-in-one toolkit for JavaScript and TypeScript apps. It starts fast, runs fast, and has a built-in package manager, test runner, and bundler. Hono is a small, simple, and ultrafast web framework built on Web Standards. Together, they form an incredible stack for modern backend services. In this article, we will go through setting up a project, writing middleware, and serving our first API requests.\n\nSetting up Hono on Bun is incredibly easy. First, you initialize a new project using the Bun init command or create a simple package.json. Then, you can install Hono using "bun add hono". The entry point can be a simple index.ts that imports Hono and starts the server.\n\nUnlike traditional Node.js applications that require complex tooling like ts-node or bundlers to run TypeScript, Bun natively executes TypeScript files. This means you can run your Hono app directly with "bun index.ts" and get instant hot reloading by adding the "--hot" flag. The performance benefits are clear: Hono\'s router is optimized for speed, and Bun\'s startup time is sub-millisecond, making it ideal for serverless deployments. This tutorial has covered the basic setup, routing, and hot reloading configuration to get you up and running quickly with these modern web technologies.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    title: 'Mastering TypeScript Strict Mode',
    summary:
      'Learn how to configure and write production-grade TypeScript with strict type checking enabled.',
    content:
      'TypeScript’s strict mode is a collection of compiler flags that enable stronger type checking guarantees. Writing strict TypeScript prevents common runtime bugs like "Cannot read properties of undefined" and enforces cleaner APIs. We will analyze the importance of flags like strictNullChecks, noImplicitAny, and noUncheckedIndexedAccess.\n\nWhen you enable "strict": true in your tsconfig.json, TypeScript activates a suite of checks that elevate code safety. One of the most important flags is strictNullChecks, which forces you to handle null and undefined explicitly. This eliminates the notorious "billion-dollar mistake" of null references at runtime.\n\nAnother critical check is noUncheckedIndexedAccess. When indexing into an array or object, this flag forces TypeScript to type the result as potentially undefined, protecting your code from out-of-bounds index errors. By using strict mode, you ensure that type contracts are bulletproof and that your codebase remains highly maintainable as it grows over time. We will also examine how exactOptionalPropertyTypes prevents assigning undefined to properties that are optionally present, leading to safer object shapes and consistent class properties.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    title: 'Understanding Drizzle ORM',
    summary:
      'An intro to Drizzle ORM—the next generation TypeScript-first SQL mapper for Node and Bun.',
    content:
      'Drizzle ORM is a lightweight, type-safe Object Relational Mapper that feels like writing SQL. Unlike other heavy ORMs, Drizzle has zero overhead, compiles down to simple queries, and provides full TypeScript autocompletion for database operations. It works beautifully with SQLite, PostgreSQL, and MySQL.\n\nWith Drizzle, you define your database schema using standard TypeScript files. Columns are declared with specific data types like text, integer, and timestamp. The major advantage is that Drizzle infers TypeScript types directly from your schema declaration. This means that when you write a select query, the returned data structure matches your database columns perfectly, with autocomplete in your IDE.\n\nAdditionally, Drizzle Kit provides a CLI tool for managing database migrations. By running "drizzle-kit generate", it compares your schema file with your previous migrations and automatically writes SQL files for schema changes. This process is deterministic and highly reliable. For developers transitioning from Prisma, Drizzle offers much faster execution times and does not require a heavy Rust binary to run queries, making it perfect for Edge environments and low-memory SQLite backends. Swapping database engines is as simple as changing the driver wrapper, keeping your business code intact.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
  },
  {
    title: 'Building a Full-Stack Monorepo',
    summary: 'A step-by-step walkthrough of setting up a type-safe monorepo with Bun Workspaces.',
    content:
      'Monorepos allow developers to manage multiple packages or apps in a single repository. With Bun Workspaces, managing dependencies, running scripts across packages, and sharing code between frontend and backend is incredibly straightforward. This article guides you on building a shared Types package and linking it to multiple Vite applications.\n\nFirst, setup your root package.json. You define the "workspaces" key as an array pointing to "apps/*" and "packages/*". When you run "bun install", Bun resolves all dependencies, shares common modules via symlinks, and caches packages globally, reducing duplicate disk space.\n\nNext, let\'s create the shared package under packages/shared. This package is configured with typescript declarations enabled and composite options turned on. By exporting Zod schemas and TypeScript types, the shared package becomes the single source of truth for the entire platform. The api backend uses the same Zod schemas to validate requests, while the React admin dashboard uses them to validate inputs inside form handlers. This ensures contract parity across client-server boundaries, meaning any schema change is immediately checked by the TypeScript compiler on both sides.\n\nFinally, we add our React apps under apps/admin and apps/web. Both of these apps import from @article-platform/shared. Thanks to Bun workspaces, local modifications in packages/shared are instantly picked up by Vite\'s hot module reloading without requiring a manual build or publish step, dramatically improving the developer experience. This creates an incredibly smooth and fast pipeline.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  },
  {
    title: 'Introduction to Tailwind CSS v4',
    summary:
      'What’s new in Tailwind CSS v4 and how it improves styling workflow with native CSS variables.',
    content:
      'Tailwind CSS v4 introduces a completely redesigned engine built for speed and modern CSS. It features a new CSS-first configuration, native cascading variables, and improved performance, making utility styling faster and cleaner. We will look at how the configuration has changed and how to leverage the new theme syntax.\n\nOne of the biggest changes in v4 is the removal of the tailwind.config.js JavaScript configuration file. Instead, everything is configured directly inside your main index.css file using standard CSS rules. For example, defining custom theme colors is as simple as using the @theme directive and declaring standard CSS custom properties. This results in a cleaner developer workflow and better integration with browser DevTools.\n\nUnder the hood, Tailwind v4 leverages Lightningcss to compile your utility classes with extreme speed. The compiler is up to 10 times faster than v3, which means your build times and hot-reload latency are virtually non-existent even in massive enterprise projects. It also drops legacy configurations to embrace modern CSS standards, generating highly optimized styles for your final bundle.',
    status: 'draft' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
  },
  {
    title: 'REST API Best Practices for 2026',
    summary:
      'Designing clean, consistent, and secure REST APIs with JSON envelopes and semantic status codes.',
    content:
      'API design is more than just mapping CRUD to URLs. Consistency in response structures, semantic usage of HTTP status codes, structured error handling, and type-safe payloads are critical for developer experience and reliability. We will discuss best practices around API versioning, CORS handling, and formatting error messages.\n\nWhen designing REST API resources, it is critical to use nouns rather than verbs in URL paths. For example, using POST /api/articles is preferred over POST /api/createArticle. Plural nouns for collection references help keep your routing clean and intuitive. Additionally, all API responses should be wrapped in a consistent JSON envelope, such as having success, data, and error fields, so that frontend clients can write standard wrapper utilities for fetch requests.\n\nError handling is another area that separates junior and senior designs. Internal database exceptions, like column constraint failures or system out-of-memory errors, should never be exposed directly to the client. Instead, your backend should use a global error handler middleware that catches raw exceptions, logs the full stack trace to secure server logging systems, and returns a clean, safe, user-friendly error message with the appropriate HTTP status code (such as 400 for input errors, 401 for auth failure, and 500 for server issues).',
    status: 'draft' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
  },
  {
    title: 'أهمية تعلم لغة البرمجة تايب سكريبت',
    summary:
      'لماذا يجب على مطوري الويب الانتقال إلى تايب سكريبت في مشاريعهم البرمجية لضمان جودة الأكواد.',
    content:
      'تعتبر لغة تايب سكريبت (TypeScript) إضافة قوية للغة جافا سكريبت الشهيرة، حيث تضيف ميزة تحديد الأنواع بشكل صارم وقوي. يساعد هذا المطورين على تجنب الأخطاء الشائعة أثناء كتابة الكود وقبل تشغيله، مما يرفع من كفاءة وجودة التطبيقات البرمجية بشكل كبير ويعزز من إنتاجية الفريق البرمجي وسرعة الصيانة الفنية للمشروعات.\n\nعندما تقوم بتطوير تطبيقات برمجية كبيرة، فإن تتبع المتغيرات والدوال ومخرجاتها يصبح معقداً وصعباً للغاية مع جافا سكريبت العادية. هنا تأتي قوة تايب سكريبت لتفرض عقوداً واضحة للبيانات (Data Contracts). المترجم سيقوم برفض تشغيل الكود فوراً إذا قمت بتمرير مصفوفة بدلاً من نص، أو إذا حاولت الوصول إلى حقل غير موجود في كائن ما، مما يعني حل 90% من المشاكل والأخطاء البرمجية الشائعة قبل وصولها إلى بيئة الإنتاج.\n\nبالإضافة إلى ذلك، فإن تايب سكريبت توفر للمطورين تجربة تطوير استثنائية (Developer Experience) من خلال الإكمال التلقائي الذكي للأكواد (Autocomplete) والتنقل السريع بين ملفات المشروع داخل بيئة التطوير (IDE). هذا يسهل انضمام مطورين جدد للفريق ويجعل الكود قابلاً للتطوير والصيانة على المدى الطويل دون خوف من حدوث تراجعات أو أعطال غير متوقعة في الأجزاء الأخرى من النظام البرمجي.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days ago
  },
  {
    title: 'How to Implement JWT Auth in Hono',
    summary: 'Enforcing role-based access control and JWT verification using Hono middleware.',
    content:
      "JSON Web Tokens (JWT) are a stateless way of representing claims between parties. In Hono, implementing JWT authentication is straightforward using Hono’s built-in JWT middleware or standard libraries like jose. We can sign tokens on login, set their expiration, and verify them on protected admin routes.\n\nJWT tokens consist of three parts: a header specifying the algorithm, a payload containing user claims (such as username, role, and expiration date), and a signature verified using a server-side secret key. When a user successfully logs in, the server generates this token and returns it to the client, which stores it in memory or localStorage.\n\nOn subsequent requests, the client includes the token in the Authorization header as a Bearer string. A custom auth middleware in Hono reads this header, verifies the signature using the text-encoded secret, and extracts the payload. If the signature is invalid or the token has expired, the middleware throws an UnauthorizedError, which is caught by the global error handler and returned to the client as a 401 response. If valid, the user metadata is injected into the context, allowing subsequent routes to access the authenticated user's details easily.",
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(), // 22 days ago
  },
  {
    title: 'Dockerizing Bun Applications',
    summary: 'Multi-stage Docker builds optimized for Bun runtimes to achieve minimal image size.',
    content:
      'Docker allows developers to package applications with their entire environment. For Bun applications, we can use multi-stage builds to install development dependencies, build static assets, and run the production server inside a lightweight alpine base image. This ensures reproducible environments in staging and production.\n\nMulti-stage building is a technique that uses multiple FROM statements in a single Dockerfile. The first stage installs all development dependencies and compiles source files. The second stage builds the production-ready build files. The third and final stage only copies the production files and the node_modules folder into a fresh, lightweight alpine base image, leaving behind compilers, source code, and temporary build caches.\n\nThis dramatically reduces the final Docker image size from several gigabytes down to a few megabytes. It also improves security by ensuring that compilers and source code are not present in the runtime container, limiting the attack surface. In this monorepo, our Dockerfile defines target stages for each app, allowing you to deploy the API, Admin, and Web applications as separate, lightweight containers connected on a shared virtual network, orchestrating the startup order via healthchecks.',
    status: 'draft' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(), // 25 days ago
  },
  {
    title: 'Writing Effective Unit Tests in Vitest',
    summary: 'A guide to testing business logic and API endpoints in TypeScript with Vitest.',
    content:
      'Testing is the cornerstone of robust software. Vitest is a fast, modern testing framework built on Vite. It supports native ESM, TypeScript, and has compatibility with Jest API, making it an excellent choice for testing utility functions, services, and route endpoints. We will look at mocking database calls and testing async logic.\n\nWith Vitest, running tests takes milliseconds thanks to its native Vite-based worker thread design. In this project, we test the shared package and the Hono API routes. We mock database connections using isolated SQLite instances so that tests do not write into development or production databases. Each test file sets up and cleans up database tables between runs, ensuring complete test isolation.\n\nWriting meaningful unit tests requires checking both positive and negative flows. For instance, testing a create article service should check that a valid payload succeeds, that the generated slug is correct, and that duplicate titles are resolved by adding numbered suffixes. Conversely, negative tests should check that invalid inputs (like short titles) fail validation schemas and that unauthorized requests to admin endpoints return a 401 status code. This comprehensive coverage gives you the confidence that your application remains solid during future refactorings.',
    status: 'published' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  },
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Delete existing articles
    await db.delete(articles).execute();
    console.log('🧹 Cleaned existing articles.');

    // Insert new articles
    for (const article of sampleArticles) {
      const slug = generateSlug(article.title);
      await db
        .insert(articles)
        .values({
          title: article.title,
          slug,
          summary: article.summary,
          content: article.content,
          status: article.status,
          createdAt: article.createdAt,
          updatedAt: article.createdAt,
        })
        .execute();
      console.log(`\u2705 Seeded article: "${article.title}" (slug: ${slug})`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
