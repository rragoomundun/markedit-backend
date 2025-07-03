import { Sequelize } from 'sequelize';
import colors from 'colors';

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false
});

try {
  await sequelize.authenticate();
  console.log(`[OK] Connected to database ${process.env.DB_DATABASE} on port ${process.env.DB_PORT}`.green);
} catch {
  console.log('[FAILED] Connection to database failed'.red);
  process.exit(1);
}

export default sequelize;
