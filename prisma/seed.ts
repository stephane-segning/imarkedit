import { PrismaClient } from '@prisma/client';
import { generateKeyPair } from '../lib/imarkedit-crypto/src';

const prisma = new PrismaClient();

async function checkKey() {
  const found = await prisma.oAuth2Key.findFirst({
    where: {
      enabled: true
    }
  });

  if (found) {
    return;
  }

  const keyPair = await generateKeyPair();
  await prisma.oAuth2Key.create({
    data: {
      enabled: true,
      publicData: {
        publicKey: keyPair.publicKey
      },
      privateData: {
        privateKey: keyPair.privateKey,
        algo: 'RS256'
      }
    }
  });
}

async function checkClient() {
  const name = 'imarkedit-client';
  const found = await prisma.oAuth2Client.findFirst({
    where: {
      name
    }
  });

  if (found) {
    return;
  }

  await prisma.oAuth2Client.create({
    data: {
      name,
      accessTokenLifetime: 3600, // 1 hour
      refreshTokenLifetime: 2592000, // 30 days
      grants: ['urn:public-key:grant-type', 'refresh_token']
    }
  });

}

async function main() {
  await checkKey();
  await checkClient();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
