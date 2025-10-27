import { init } from '@paralleldrive/cuid2'
import crypto from 'crypto';
import Logger from './logger';
import { ServiceUnavailableException } from './error';

const logger = new Logger("util");

export const compareStrings = (str1: unknown, str2: unknown) => {
  return String(str1)?.toLowerCase() === String(str2)?.toLowerCase();
}

export const isEmpty = (mixedVar: any) => {
  let undef;
  let key;
  let i;
  let len;
  const emptyValues = [undef, null, false, 0, '', '0', 'null', 'undefined'];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i] || typeof mixedVar == 'undefined') {
      return true;
    }
  }

  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      if (mixedVar.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export const slugify = (value: string) => {
  return value?.replace(/\s+/g, "-").toLowerCase();
}

export const getUniqueCode = (length: number, type: "number" | "alphanumeric" = 'alphanumeric', prefix: string = "") => {
  let code: number | string;
  if(type !== "number"){
    const createId = init({ length });
    code = createId()?.toString();
  } else {
    const timestamp = Date.now() % (10 ** (length - 3));
    const randomComponent = parseInt(crypto.randomBytes(2).toString('hex'), 16) % 1000;
    const uniqueNumber = timestamp * 1000 + randomComponent;
    code = parseInt(String(uniqueNumber));
  }

  return `${prefix}${code}`;
}

export function getEnvOrThrow(key: string, defaultValue?: string) {
  const value = process.env?.[key] || defaultValue;
  if (!value) {
    logger.error(`Environment variable ${key} is not set`)
    throw new ServiceUnavailableException()
  }

  const values = value.split(",");
  const randomValue = values[Math.floor(Math.random() * values.length)];

  return randomValue;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
}

export const internationalizePhoneNumber = (phone: string) => {
  return phone.replace(/^(\+234|0)/, "+234");
}