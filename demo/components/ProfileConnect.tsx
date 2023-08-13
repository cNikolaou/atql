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
        <div className="text-placeholder h-[expectedHeight]"></div>
        <div>{address}</div>
      </div>
    );
  return (
    <button className="btn-blue" onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}
