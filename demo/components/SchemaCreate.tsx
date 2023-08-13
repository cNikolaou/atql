import React, { useState } from 'react';

export default function SchemaCreate() {
  const [schema, setSchema] = useState('');
  const [schemaUid, setSchemaUid] = useState('');

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSchema(event.target.value);
  }

  async function createSchema() {
    if (schema !== '') {
      const reqData = {
        schema: schema,
      };

      console.log(reqData);

      const res = await fetch('/api/schema-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      });

      const data = await res.json();
      console.log(data);
      setSchemaUid(data.schemaUid);
    } else {
      console.error('Schema is empty!');
    }
  }

  return (
    <>
      <label htmlFor="schema">Schema Definition</label>
      <input
        type="text"
        id="schema"
        value={schema}
        onChange={handleInputChange}
        placeholder="Enter schema..."
      />
      <button className="btn-purple" onClick={createSchema}>
        Create Schema
      </button>

      {schemaUid !== '' && (
        <div className="mt-5 text-xs text-gray-500 w-48 break-words">Schema UID: {schemaUid}</div>
      )}
    </>
  );
}
