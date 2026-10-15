export interface Broker {
  id: string;
  name: string;
  domain: string;
}

export const BROKERS: readonly Broker[] = [
  { id: 'ibkr', name: 'Interactive Brokers', domain: 'interactivebrokers.com' },
  { id: 'xtb', name: 'XTB', domain: 'xtb.com' },
  { id: 'trading212', name: 'Trading 212', domain: 'trading212.com' },
  { id: 'degiro', name: 'DEGIRO', domain: 'degiro.com' },
  { id: 'revolut', name: 'Revolut', domain: 'revolut.com' },
  { id: 'robinhood', name: 'Robinhood', domain: 'robinhood.com' },
  { id: 'etoro', name: 'eToro', domain: 'etoro.com' },
  { id: 'schwab', name: 'Charles Schwab', domain: 'schwab.com' },
  { id: 'fidelity', name: 'Fidelity', domain: 'fidelity.com' },
  { id: 'vanguard', name: 'Vanguard', domain: 'vanguard.com' },
] as const;

export function getBrokerById(id: string): Broker | undefined {
  return BROKERS.find((broker) => broker.id === id);
}

export function getBrokerByName(name: string): Broker | undefined {
  return BROKERS.find(
    (broker) => broker.name.toLowerCase() === name.toLowerCase(),
  );
}
