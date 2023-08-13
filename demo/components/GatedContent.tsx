import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function GatedContent() {
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const fetchUserPrivileges = async () => {
      try {
        const reqData = {
          address: address,
        };

        console.log(reqData);

        const res = await fetch('/api/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });

        const data = await res.json();
        console.log(data);
        setIsSuperuser(data.isSuperuser);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    fetchUserPrivileges();

    // Set up polling every few seconds (e.g., 5 seconds)
    const intervalId = setInterval(fetchUserPrivileges, 5000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  function createPoll() {
    alert('Create Poll');
  }

  return (
    <>
      <button
        disabled={!isAdmin}
        className={isAdmin ? 'btn-yellow' : 'btn-yellow-disabled'}
        onClick={createPoll}
      >
        Admin Create Poll
      </button>
      <div className="border-2 border-black p-6">
        <div className={address ? (isSuperuser ? 'green-box' : 'red-box') : ''}>
          <h2>
            Are you a superuser? {address ? (isSuperuser ? 'Yes' : 'No') : 'Connect to find out!'}
          </h2>
        </div>
      </div>
    </>
  );
}
