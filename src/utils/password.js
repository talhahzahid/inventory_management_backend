import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config ();

export default function randomPasswordGenerate (length = 12) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';

  const randomBytes = crypto.randomBytes (length);
  console.log (randomBytes, 'randomBytes');
  for (let i = 0; i < length; i++) {
    password += characters[randomBytes[i] % characters.length];
  }

  return password;
}
