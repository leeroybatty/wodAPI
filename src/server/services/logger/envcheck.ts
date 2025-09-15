import dotenv from 'dotenv';
dotenv.config();
export const NODE_ENV = requireEnvVar("NODE_ENV") as 
  | "development"
  | "test"
  | "staging"
  | "production";

export function requireEnvVar(name: string): string {
    const envVar = process.env[name];
    const currentEnv = process.env["NODE_ENV"] || 'development';
    if (envVar === undefined || envVar == null) {
        throw new Error(currentEnv === 'development' ? `Missing env variable: ${name}` : 'Service unavailable.');
    }
    return envVar;
}