import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function GatedContent() {
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserPrivileges = async () => {
      try {
        const reqData = {
          address: address,
        };

        console.log('reqData');
        console.log(reqData);

        console.log('SEND REQUEST');
        const res = await fetch('/api/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });

        const data = await res.json();
        console.log(data);
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

  return (
    <>
      <button className={isAdmin ? 'btn-yellow' : 'btn-yellow-disabled'}>Admin Content</button>
    </>
  );
}