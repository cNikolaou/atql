import { Inter } from 'next/font/google';
import ProfileConnect from '../components/ProfileConnect';
import GatedContent from '../components/GatedContent';
import SchemaCreate from '../components/SchemaCreate';
import AttestationCreate from '../components/AttestationCreate';
import AttestationRevoke from '../components/AttestationRevoke';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="flex h-screen space-x-4">
      <div className="screen-part">
        <h1>Create Schema</h1>
        <div className="main-items">
          <SchemaCreate />
        </div>
      </div>
      <div className="screen-part">
        <h1>Make Attestation</h1>
        <div className="main-items">
          <AttestationCreate />
        </div>
      </div>
      <div className="screen-part">
        <h1>Revoke Attestation</h1>
        <div className="main-items">
          <AttestationRevoke />
        </div>
      </div>
      <div className="screen-part">
        <h1>Access Content</h1>

        <div className="main-with-buttons">
          <GatedContent />
          <ProfileConnect />
        </div>
      </div>
    </div>
  );
}
