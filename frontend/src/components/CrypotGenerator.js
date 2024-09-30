import React, { useState } from "react";

function CrypotGenerator() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = async () => {
    if (privateKey) {
      try {
        await navigator.clipboard.writeText(privateKey);
        setCopySuccess("Copied to clipboard!");
      } catch (err) {
        setCopySuccess("Failed to copy!");
      }
    }
  };

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  async function exportCryptoKey(key, type) {
    const format = type === "PUBLIC" ? "spki" : "pkcs8";
    const exported = await window.crypto.subtle.exportKey(format, key);
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN ${type} KEY-----\n${exportedAsBase64}\n-----END ${type} KEY-----`;

    type === "PUBLIC" ? setPublicKey(pemExported) : setPrivateKey(pemExported);
  }

  // Generate RSA Key Pair
  const generateKeyPair = async () => {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096, // key size
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: "SHA-256", // for OAEP
      },
      true, // extractable
      ["encrypt", "decrypt"] // key usages
    );
    exportCryptoKey(publicKey, "PUBLIC");
    exportCryptoKey(privateKey, "PRIVATE");
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Public Key*:</label>
        <div className="flex gap-1 justify-between">
          <input
            type="text"
            placeholder="Public Key"
            value={publicKey}
            className="mt-2 p-2 w-full border rounded-md disabled:block"
          />

          <button
            type="button"
            className="p-2 mt-2 text-nowrap rounded-md bg-blue-500 hover:bg-blue-900 text-white"
            onClick={generateKeyPair}
          >
            Generate Keys
          </button>
        </div>
      </div>

      {privateKey && privateKey.length > 0 && (
        <div className="mb-4">
          <label className="block text-red-900 font-bold">
            Please ensure you copy and store the private key in a safe place.
            Once lost, it cannot be recovered.
          </label>
          <div className="flex gap-1 justify-between">
            <input
              type="text"
              placeholder="Private Key"
              value={privateKey}
              className="mt-2 p-2 w-full border rounded-md "
            />

            <button
              type="button"
              className="p-2 mt-2 text-nowrap rounded-md bg-blue-500 hover:bg-blue-900 text-white"
              onClick={copyToClipboard}
            >
              Copy
            </button>
            {copySuccess && (
              <span className="p-2 text-green-600 text-sm">{copySuccess}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CrypotGenerator;
