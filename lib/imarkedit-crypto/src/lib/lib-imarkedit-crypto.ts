import * as forge from 'node-forge';

export async function generateKeyPair() {
  const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair({
    bits: 2048,
    workers: -1,
  });
  return {
    publicKey: publicKeyToPem(publicKey),
    privateKey: privateKeyToPem(privateKey),
  };
}

// Function to sign data using a private key
export async function signData(
  privateKeyPem: string,
  data: string
): Promise<string> {
  const privateKey: forge.pki.rsa.PrivateKey = pemToPrivateKey(privateKeyPem);
  const md: forge.md.MessageDigest = forge.md.sha256.create();
  md.update(data, 'utf8');
  const signature: string = privateKey.sign(md);
  return forge.util.encode64(signature);
}

// Function to verify a signature using a public key
export async function verifySignature(
  publicKeyPem: string,
  data: string,
  signature: string
): Promise<boolean> {
  const publicKey: forge.pki.rsa.PublicKey = pemToPublicKey(publicKeyPem);
  const md: forge.md.MessageDigest = forge.md.sha256.create();
  md.update(data, 'utf8');
  const decodedSignature = forge.util.decode64(signature);
  return publicKey.verify(md.digest().bytes(), decodedSignature);
}

export function publicKeyToPem(publicKey: forge.pki.rsa.PublicKey): string {
  return forge.pki.publicKeyToPem(publicKey);
}

function pemToPublicKey(pem: string): forge.pki.rsa.PublicKey {
  return forge.pki.publicKeyFromPem(pem);
}

function privateKeyToPem(privateKey: forge.pki.rsa.PrivateKey): string {
  return forge.pki.privateKeyToPem(privateKey);
}

function pemToPrivateKey(pem: string): forge.pki.rsa.PrivateKey {
  return forge.pki.privateKeyFromPem(pem);
}
