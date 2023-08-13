import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function ProfileConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        <button className="btn-blue" onClick={() => disconnect()}>
          Disconnect
        </button>
        <div className="small-tx">Account:</div>
        <div className="mt-5 text-xs text-gray-500 w-48">{address}</div>
      </div>
    );
  return (
    <>
      <button className="btn-blue" onClick={() => connect()}>
        Connect Wallet
      </button>
      <div className="small-tx">Account:</div>
      <div className="small-tx">Not connected yet</div>
    </>
  );
}
