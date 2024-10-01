async function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

const pemToArrayBuffer = async (pem, type) => {
  // Remove the header and footer of the PEM string
  pem = pem.trim();
  const pemHeader =
    type === "PUBLIC"
      ? "-----BEGIN PUBLIC KEY-----"
      : "-----BEGIN PRIVATE KEY-----";
  const pemFooter =
    type === "PUBLIC"
      ? "-----END PUBLIC KEY-----"
      : "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length - 1
  );

  // Decode the base64-encoded string to an ArrayBuffer
  const binaryString = atob(pemContents);
  const binaryDer = await str2ab(binaryString);

  return binaryDer;
};

const importKey = async (pemKey, keyType) => {
  const keyBuffer = await pemToArrayBuffer(pemKey, keyType);

  const algorithm = {
    name: "RSA-OAEP",
    hash: { name: "SHA-256" }, // Hashing algorithm
  };

  const format = keyType === "PUBLIC" ? "spki" : "pkcs8";
  const keyUsages = keyType === "PUBLIC" ? ["encrypt"] : ["decrypt"];

  // Import the key based on type (spki for PUBLIC, pkcs8 for PRIVATE)
  return await window.crypto.subtle.importKey(
    format,
    keyBuffer,
    algorithm,
    true,
    keyUsages
  );
};

// Encrypt Data
export const encryptData = async (inputData) => {
  const publicKey = await importKey(
    localStorage.getItem("publicKey"),
    "PUBLIC"
  );
  const encoder = new TextEncoder();
  const data = encoder.encode(inputData);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  );
  const stringData = await ab2str(encryptedData);
  const encryptedDataBase64 = btoa(stringData);
  return encryptedDataBase64;
};

export const decryptData = async (encryptedData, privateKey) => {
  try {
    const formatPrivateKey = await importKey(privateKey, "PRIVATE");

    const encryptedDataString = atob(encryptedData);

    const encryptedDataBuffer = await str2ab(encryptedDataString);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      formatPrivateKey, // Private key for decryption
      encryptedDataBuffer // Encrypted data
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decrypted);
    return decryptedString;
  } catch (e) {
    alert("Something went wrong please try again latter.");
  }
};
