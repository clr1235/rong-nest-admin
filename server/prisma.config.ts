import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import type { PrismaConfig } from 'prisma';

// 加载YAML配置文件
try {
  const config = yaml.load(
    readFileSync(join(__dirname, 'src/config/dev.yml'), 'utf8'),
  ) as Record<string, any>;

  // 设置环境变量
  process.env.DATABASE_URL = config.db.mysql.url;
} catch (error) {
  console.error('Failed to load YAML configuration:', error);
}

export default {
  schema: join(__dirname, 'prisma/schema/schema.prisma'),
  migrations: {
    path: join(__dirname, 'prisma/migrations'),
  },
} satisfies PrismaConfig;
