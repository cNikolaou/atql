import React, { useState } from 'react';

export default function SchemaCreate() {
  const [attestationUid, setAttestationUid] = useState('');
  const [revoked, setRevoked] = useState(false);

  function handleAttestationUidChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAttestationUid(event.target.value);
  }

  async function revokeAttestation() {
    if (attestationUid !== '') {
      const reqData = {
        attestationUid: attestationUid,
      };

      const res = await fetch('/api/attestation-revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });

      const data = await res.json();
      console.log(data);
      setRevoked(data.result);
    } else {
      console.error('Schema UID or recipient or role is missing!');
    }
  }

  return (
    <>
      <label htmlFor="attestation-uid">Attestation UID</label>
      <input
        type="text"
        id="attestation-uid"
        value={attestationUid}
        onChange={handleAttestationUidChange}
        placeholder="Enter attestation UID..."
      />

      <button className="btn-purple" onClick={revokeAttestation}>
        Revoke Attestation
      </button>

      {revoked && (
        <div className="mt-5 text-xs text-gray-500 w-48 break-words">
          Attestation with UID: {attestationUid} revoked!
        </div>
      )}
    </>
  );
}
