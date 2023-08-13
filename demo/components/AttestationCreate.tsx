import React, { useState } from 'react';

export default function SchemaCreate() {
  const [schemaUid, setSchemaUid] = useState(
    '0x2154bad5fb5faf4e115afd58f23afdf112225816e0c58b682071470a5de9aafb',
  );
  const [recipient, setRecipient] = useState('');
  const [role, setRole] = useState('');
  const [attestationUid, setAttestationUid] = useState('');

  function handleSchemaChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSchemaUid(event.target.value);
  }

  function handleRecipientChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRecipient(event.target.value);
  }

  function handleRoleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRole(event.target.value);
  }

  async function createAttestation() {
    if (schemaUid !== '' && recipient !== '' && role !== '') {
      const reqData = {
        schemaUid: schemaUid,
        recipient: recipient,
        role: role,
      };

      const res = await fetch('/api/attestation-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });

      const data = await res.json();
      setAttestationUid(data.attestationUid);
    } else {
      console.error('Schema UID or recipient or role is missing!');
    }
  }

  return (
    <>
      <label htmlFor="schema-uid">Schema UID</label>
      <input
        type="text"
        id="schema-uid"
        value={schemaUid}
        onChange={handleSchemaChange}
        placeholder="Enter schema UID..."
      />
      <label htmlFor="recipient">Recipient Address</label>
      <input
        type="text"
        id="recipient"
        value={recipient}
        onChange={handleRecipientChange}
        placeholder="Enter recipient address..."
      />
      <label htmlFor="role">Recipient Role</label>
      <input
        type="text"
        id="role"
        value={role}
        onChange={handleRoleChange}
        placeholder="Enter role for address..."
      />
      <button className="btn-purple" onClick={createAttestation}>
        Make Attestation
      </button>

      {attestationUid !== '' && (
        <div className="mt-5 text-xs text-gray-500 w-48 break-words">
          Attestation UID: {attestationUid}
        </div>
      )}
    </>
  );
}
