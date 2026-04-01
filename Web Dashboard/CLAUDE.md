# Composed Claude Code Configuration

This configuration combines: Vercel AI SDK, Drizzle ORM

---

## Project Context

*Combined from: Vercel AI SDK, Drizzle ORM*

This is a comprehensive project that combines multiple technologies:

This project uses the **Vercel AI SDK** for building AI applications with:

- **Multiple providers** - Anthropic, OpenAI, Google, etc.
- **Streaming responses** - Real-time AI interactions
- **Function calling** - Tool use and structured outputs
- **React integration** - useChat, useCompletion hooks
- **Edge runtime support** - Optimized for serverless
- **TypeScript-first** - Full type safety

This project uses **Drizzle ORM** for type-safe database operations with:

- **TypeScript-first** approach with full type inference
- **SQL-like syntax** that's familiar and powerful
- **Multiple database support** - PostgreSQL, MySQL, SQLite
- **Automatic migrations** with schema versioning
- **Performance optimized** with prepared statements
- **Edge runtime compatible** - Works with serverless

## Security Best Practices

1. **API Key Management**
   - Store keys in environment variables
   - Never expose keys in client-side code
   - Use different keys for development/production
   - Rotate keys regularly

2. **Input Validation**
   - Validate all user inputs with Zod
   - Sanitize data before sending to AI
   - Implement rate limiting on API endpoints
   - Set message length limits

3. **Output Security**
   - Sanitize AI responses before rendering
   - Implement content filtering for inappropriate responses
   - Handle streaming errors gracefully
   - Log security events for monitoring

## Performance Optimization

*Combined from: Vercel AI SDK, Drizzle ORM*

1. **Streaming Efficiency**
   - Use appropriate chunk sizes for streaming
   - Implement proper backpressure handling
   - Cache provider instances
   - Use Edge Runtime when possible
2. **Provider Selection**
   - Choose appropriate models for task complexity
   - Implement intelligent provider fallbacks
   - Monitor response times and costs
   - Use faster models for simple tasks
3. **Client-Side Optimization**
   - Implement message deduplication
   - Use React.memo for message components
   - Implement virtual scrolling for long conversations
   - Optimize re-renders with proper key usage

## 🏗️ Architecture Patterns

- **RAG Systems** - Embeddings, vector databases, semantic search, knowledge retrieval
- **Multi-Modal Applications** - Image/PDF processing, document analysis, media handling
- **Streaming Applications** - Real-time responses, chat interfaces, progressive updates
- **Agent Systems** - Tool calling, multi-step workflows, function execution
- **Provider Management** - Multi-provider setups, fallbacks, cost optimization

## Common Commands

*Combined from: Vercel AI SDK, Drizzle ORM*

```bash

## Query Testing

*Combined from: Vercel AI SDK, Drizzle ORM*

```bash
npm test                                        # Run tests
npm run test:api                               # Test API endpoints
npm run test:stream                            # Test streaming functionality
```
```typescript
import { POST } from '@/app/api/chat/route';
describe('/api/chat', () => {
  it('should stream responses', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
  });
});
```
import { renderHook, act } from '@testing-library/react';
import { useChat } from 'ai/react';
describe('useChat', () => {
  it('should handle message submission', async () => {
    const { result } = renderHook(() => useChat({ api: '/api/chat' }));
    act(() => {
      result.current.setInput('Test message');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.messages).toHaveLength(2);
  });
});
```
// tests/queries.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup';
import { users } from '@/schema/users';
import { createUser, getUserByEmail } from '@/lib/queries/users';
describe('User Queries', () => {
  let db: ReturnType<typeof createTestDb>;
  beforeEach(() => {
    db = createTestDb();
  });
  it('should create and retrieve user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
    };
    const user = await createUser(userData);
    expect(user.email).toBe(userData.email);
    const retrievedUser = await getUserByEmail(userData.email);
    expect(retrievedUser).toEqual(user);
  });
});
```

## Deployment Considerations

1. **Environment Variables**
   - Configure all provider API keys
   - Set appropriate CORS headers
   - Configure rate limiting
   - Set up monitoring and alerting

2. **Edge Runtime**
   - Use Edge Runtime for better performance
   - Implement proper error boundaries
   - Handle cold starts gracefully
   - Monitor execution time limits

3. **Scaling Considerations**
   - Implement proper caching strategies
   - Use connection pooling for databases
   - Monitor API usage and costs
   - Set up automatic scaling rules

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [Schema Reference](https://orm.drizzle.team/docs/sql-schema-declaration)
- [Query Reference](https://orm.drizzle.team/docs/rqb)
- [Migration Guide](https://orm.drizzle.team/docs/migrations)

Remember: **Type safety first, optimize with indexes, use transactions for consistency, and prepare statements for performance!**

# Vercel AI SDK Development Expert 🤖

You are a comprehensive Vercel AI SDK expert with deep expertise in streaming, function calling, RAG systems, multi-modal applications, agent development, provider management, and production deployment.

## Memory Integration

This CLAUDE.md follows Claude Code memory management patterns:

- **Project memory** - Shared Vercel AI SDK best practices with team
- **Integration patterns** - Works with Next.js 15 and React 19
- **Tool compatibility** - Optimized for Claude Code development workflows
- **Auto-discovery** - Loaded when working with AI SDK files
- **Expert guidance** - Comprehensive knowledge from official documentation

## Specialized Agents

Expert AI agents available for specific tasks:

- **RAG Developer** - Building retrieval-augmented generation systems
- **Multi-Modal Expert** - Image, PDF, and media processing applications
- **Streaming Expert** - Real-time streaming implementations and chat interfaces
- **Tool Integration Specialist** - Function calling, agents, and external integrations
- **Provider Configuration Expert** - Multi-provider setups and optimization

## Available Commands

*Combined from: Vercel AI SDK, Drizzle ORM*

Project-specific slash commands for AI SDK development:
- `/ai-chat-setup [basic|advanced|multimodal|rag|agent]` - Complete chat interface setup
- `/ai-streaming-setup [text|object|chat|completion]` - Streaming implementation
- `/ai-tools-setup [simple|database|api|multimodal|agent]` - Tool and function calling
- `/ai-provider-setup [single|multi|fallback] [provider]` - Provider configuration
- `/ai-rag-setup [basic|advanced|conversational|agentic]` - RAG system setup
Use these project-specific slash commands:
- `/drizzle-schema [table-name]` - Generate type-safe schema
- `/drizzle-migrate [action]` - Handle migrations  
- `/drizzle-query [type]` - Create optimized queries
- `/drizzle-seed [table]` - Generate seed data

## 1. Provider Management

- **Multi-provider architecture** with intelligent fallbacks
- **Cost optimization** through model selection and usage tracking
- **Provider-specific features** (thinking, search, computer use)
- **Secure credential management** and environment handling

## 2. Streaming First

- **Real-time responses** with `streamText` and `streamObject`
- **Progressive UI updates** with React hooks
- **Error recovery** and stream interruption handling
- **Performance optimization** for production deployment

## 3. Tool Integration

- **Comprehensive tool definitions** with Zod validation
- **Multi-step agent workflows** with stopping conditions
- **External API integrations** with retry and error handling
- **Security and rate limiting** for production environments

## 4. Quality Assurance

- **Comprehensive testing** for all AI components
- **Error handling** with graceful degradation
- **Performance monitoring** and usage analytics
- **Security best practices** throughout development

## Basic Streaming Setup

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## React Chat Interface

```typescript
// components/chat.tsx
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## Function Calling with Tools

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

const result = await generateObject({
  model: anthropic('claude-3-sonnet-20240229'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a recipe for chocolate cookies.',
});
```

## Multi-Provider Setup

```typescript
// lib/ai-providers.ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const providers = {
  anthropic: {
    fast: anthropic('claude-3-haiku-20240307'),
    balanced: anthropic('claude-3-sonnet-20240229'),
    powerful: anthropic('claude-3-opus-20240229'),
  },
  openai: {
    fast: openai('gpt-3.5-turbo'),
    balanced: openai('gpt-4'),
    powerful: openai('gpt-4-turbo'),
  },
  google: {
    fast: google('gemini-pro'),
    powerful: google('gemini-pro'),
  },
};
```

## Development

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic  # Install core packages
npm run dev                                      # Start development server
```

## Building

```bash
npm run build                                  # Production build
npm run type-check                            # TypeScript validation
```

## Environment Setup

Create `.env.local` with your API keys:

```env

# Provider API Keys

OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional: Default provider

AI_PROVIDER=anthropic
AI_MODEL=claude-3-sonnet-20240229
```

## Stream Error Recovery

```typescript
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, error, reload, isLoading } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
      // Implement retry logic or user notification
    },
  });

  if (error) {
    return (
      <div>
        <p>Something went wrong: {error.message}</p>
        <button onClick={() => reload()}>Try again</button>
      </div>
    );
  }
}
```

## Provider Fallback

```typescript
async function generateWithFallback(prompt: string) {
  const providers = [
    () => generateText({ model: anthropic('claude-3-sonnet-20240229'), prompt }),
    () => generateText({ model: openai('gpt-4'), prompt }),
    () => generateText({ model: google('gemini-pro'), prompt }),
  ];

  for (const provider of providers) {
    try {
      return await provider();
    } catch (error) {
      console.warn('Provider failed, trying next:', error);
    }
  }

  throw new Error('All providers failed');
}
```

## Streaming Interruption

```typescript
// Handle aborted requests properly
export async function POST(req: Request) {
  const controller = new AbortController();
  
  req.signal.addEventListener('abort', () => {
    controller.abort();
  });
  
  const result = await streamText({
    model: anthropic('claude-3-sonnet-20240229'),
    messages,
    abortSignal: controller.signal,
  });
  
  return result.toDataStreamResponse();
}
```

## Type Safety

```typescript
// Define message types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Use proper typing for tools
const weatherTool = tool({
  description: 'Get weather information',
  parameters: z.object({
    location: z.string().describe('The city name'),
    unit: z.enum(['celsius', 'fahrenheit']).optional(),
  }),
  execute: async ({ location, unit = 'celsius' }) => {
    // Implementation
  },
});
```

## Development Lifecycle

This configuration includes comprehensive hooks for:

- **Automatic formatting** of TypeScript/JavaScript files
- **API route validation** and security checks
- **Dependency management** and installation notifications
- **Development reminders** for streaming and error handling
- **Session completion** checklists for quality assurance

## 1. Basic Chat Setup

```bash
/ai-chat-setup basic
```

## 2. Streaming Implementation

```bash
/ai-streaming-setup chat
```

## 4. Provider Configuration

```bash
/ai-provider-setup multi anthropic
```

## 5. RAG System

```bash
/ai-rag-setup basic
```

## Best Practices Summary

- ✅ **Always implement streaming** for better user experience
- ✅ **Use proper error handling** with retry mechanisms
- ✅ **Validate all inputs** with Zod schemas
- ✅ **Implement provider fallbacks** for reliability
- ✅ **Add comprehensive testing** for production readiness
- ✅ **Monitor usage and costs** for optimization
- ✅ **Secure API keys** and implement rate limiting
- ✅ **Document APIs** and provide usage examples

Remember: **Build robust, streaming-first AI applications with comprehensive error handling, security, and monitoring!** 🚀

# Drizzle ORM Development Assistant

You are an expert in Drizzle ORM with deep knowledge of schema management, migrations, type safety, and modern database development patterns.

## 1. Schema Definition

- **Define schemas declaratively** using Drizzle's schema builders
- **Use proper types** for each column with validation
- **Establish relationships** with foreign keys and references
- **Index strategically** for query performance
- **Version schemas** with proper migration patterns

## 2. Type Safety

- **Full TypeScript inference** from schema to queries
- **Compile-time validation** of SQL operations
- **IntelliSense support** for table columns and relations
- **Runtime validation** with Drizzle's built-in validators
- **Type-safe joins** and complex queries

## 3. Migration Management

- **Generate migrations** automatically from schema changes
- **Version control migrations** with proper naming
- **Run migrations safely** in development and production
- **Rollback support** for schema changes
- **Seed data management** for consistent environments

## PostgreSQL with Neon

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

## SQLite for Local Development

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('./dev.db');
export const db = drizzle(sqlite);
```

## MySQL with PlanetScale

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection);
```

## User Management Schema

```typescript
// schema/users.ts
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Content with Relations

```typescript
// schema/posts.ts
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

## E-commerce Schema

```typescript
// schema/ecommerce.ts
import { pgTable, serial, text, integer, decimal, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  sku: text('sku').notNull().unique(),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status', { enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});
```

## Basic CRUD Operations

```typescript
// lib/queries/users.ts
import { db } from '@/lib/db';
import { users } from '@/schema/users';
import { eq, desc, count } from 'drizzle-orm';

// Create user
export async function createUser(userData: NewUser) {
  const [user] = await db.insert(users).values(userData).returning();
  return user;
}

// Get user by ID
export async function getUserById(id: number) {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0];
}

// Get user by email
export async function getUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0];
}

// Update user
export async function updateUser(id: number, userData: Partial<NewUser>) {
  const [user] = await db
    .update(users)
    .set(userData)
    .where(eq(users.id, id))
    .returning();
  return user;
}

// Delete user
export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
}

// Get paginated users
export async function getPaginatedUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const [userList, totalCount] = await Promise.all([
    db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt)),
    db.select({ count: count() }).from(users),
  ]);
  
  return {
    users: userList,
    total: totalCount[0].count,
    page,
    totalPages: Math.ceil(totalCount[0].count / limit),
  };
}
```

## Complex Relations

```typescript
// lib/queries/posts.ts
import { db } from '@/lib/db';
import { posts, users } from '@/schema';
import { eq, desc, and, ilike } from 'drizzle-orm';

// Get posts with authors
export async function getPostsWithAuthors() {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      published: posts.published,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
}

// Search posts
export async function searchPosts(query: string) {
  return await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        ilike(posts.title, `%${query}%`)
      )
    )
    .orderBy(desc(posts.createdAt));
}

// Get user's posts
export async function getUserPosts(userId: number) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, userId))
    .orderBy(desc(posts.createdAt));
}
```

## Advanced Queries

```typescript
// lib/queries/analytics.ts
import { db } from '@/lib/db';
import { orders, orderItems, products, users } from '@/schema';
import { sum, count, avg, desc, gte } from 'drizzle-orm';

// Sales analytics
export async function getSalesAnalytics(startDate: Date, endDate: Date) {
  return await db
    .select({
      totalRevenue: sum(orders.total),
      totalOrders: count(orders.id),
      averageOrderValue: avg(orders.total),
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      )
    );
}

// Top selling products
export async function getTopSellingProducts(limit = 10) {
  return await db
    .select({
      productId: products.id,
      productName: products.name,
      totalSold: sum(orderItems.quantity),
      revenue: sum(orderItems.price),
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .groupBy(products.id, products.name)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(limit);
}
```

## Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

# Generate migration

npx drizzle-kit generate:pg

# Run migrations

npx drizzle-kit push:pg

# Introspect existing database

npx drizzle-kit introspect:pg

# View migration status

npx drizzle-kit up:pg

# Studio (database browser)

npx drizzle-kit studio
```

## Migration Scripts

```typescript
// scripts/migrate.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function runMigrations() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed!');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
```

## Seed Data

```typescript
// scripts/seed.ts
import { db } from '@/lib/db';
import { users, posts, categories } from '@/schema';

async function seedDatabase() {
  console.log('Seeding database...');
  
  // Create users
  const userIds = await db.insert(users).values([
    { email: 'admin@example.com', name: 'Admin User' },
    { email: 'user@example.com', name: 'Regular User' },
  ]).returning({ id: users.id });
  
  // Create categories
  const categoryIds = await db.insert(categories).values([
    { name: 'Technology', slug: 'technology' },
    { name: 'Design', slug: 'design' },
  ]).returning({ id: categories.id });
  
  // Create posts
  await db.insert(posts).values([
    {
      title: 'Getting Started with Drizzle',
      content: 'Learn how to use Drizzle ORM...',
      slug: 'getting-started-drizzle',
      authorId: userIds[0].id,
      published: true,
    },
    {
      title: 'Database Design Best Practices',
      content: 'Tips for designing scalable databases...',
      slug: 'database-design-best-practices',
      authorId: userIds[1].id,
      published: true,
    },
  ]);
  
  console.log('Seeding completed!');
}

seedDatabase().catch(console.error);
```

## Prepared Statements

```typescript
// lib/prepared-statements.ts
import { db } from '@/lib/db';
import { users } from '@/schema/users';
import { eq } from 'drizzle-orm';

// Prepare frequently used queries
export const getUserByIdPrepared = db
  .select()
  .from(users)
  .where(eq(users.id, placeholder('id')))
  .prepare();

export const getUserByEmailPrepared = db
  .select()
  .from(users)
  .where(eq(users.email, placeholder('email')))
  .prepare();

// Usage
const user = await getUserByIdPrepared.execute({ id: 123 });
```

## Indexes and Constraints

```typescript
// schema/optimized.ts
import { pgTable, serial, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Create indexes for better query performance
  slugIdx: uniqueIndex('posts_slug_idx').on(table.slug),
  authorIdx: index('posts_author_idx').on(table.authorId),
  publishedIdx: index('posts_published_idx').on(table.published),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}));
```

## Connection Pooling

```typescript
// lib/db-pool.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection);
```

## Test Database Setup

```typescript
// tests/setup.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite);
  
  // Run migrations
  migrate(db, { migrationsFolder: 'drizzle' });
  
  return db;
}
```

## Environment Configuration

```env

# Database URLs for different environments

DATABASE_URL=postgresql://username:password@localhost:5432/myapp_development
DATABASE_URL_TEST=postgresql://username:password@localhost:5432/myapp_test
DATABASE_URL_PRODUCTION=postgresql://username:password@host:5432/myapp_production

# For Neon (serverless PostgreSQL)

DATABASE_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# For PlanetScale (serverless MySQL)

DATABASE_URL=mysql://username:password@host.connect.psdb.cloud/database?sslmode=require

# For local SQLite

DATABASE_URL=file:./dev.db
```

## Repository Pattern

```typescript
// lib/repositories/user-repository.ts
import { db } from '@/lib/db';
import { users, User, NewUser } from '@/schema/users';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async create(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async findById(id: number): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.id, id));
    return user[0];
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
  }
  
  async update(id: number, userData: Partial<NewUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}

export const userRepository = new UserRepository();
```

## Transaction Handling

```typescript
// lib/services/order-service.ts
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/schema';
import { eq, sql } from 'drizzle-orm';

export async function createOrderWithItems(
  orderData: NewOrder,
  items: Array<{ productId: number; quantity: number }>
) {
  return await db.transaction(async (tx) => {
    // Create order
    const [order] = await tx.insert(orders).values(orderData).returning();
    
    // Create order items and update product stock
    for (const item of items) {
      // Get product price
      const product = await tx
        .select({ price: products.price, stock: products.stock })
        .from(products)
        .where(eq(products.id, item.productId));
      
      if (product[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      
      // Create order item
      await tx.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product[0].price,
      });
      
      // Update product stock
      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }
    
    return order;
  });
}
```


---

## Configuration Metadata

### Included Configurations

- **Vercel AI SDK** v1.0.0: Streaming AI applications with function calling and multi-provider support
- **Drizzle ORM** v1.0.0: Type-safe database operations with schema management and migrations

### Dependencies

#### Required Engines

- **node**: >=18.0.0

#### Peer Dependencies

These packages should be installed in your project:

- **ai**: >=3.0.0
- **typescript**: >=5.0.0
- **drizzle-orm**: >=0.40.0
- **drizzle-kit**: >=0.28.0


### Generation Details

- Generated: 2026-03-31T07:31:39.205Z
- Generator: Claude Config Composer v1.0.0

### Compatibility Notes

This is a composed configuration. Some features may require additional setup or conflict resolution.
Review the combined configuration carefully and adjust as needed for your specific project.