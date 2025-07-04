import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CheckIn } from './components/CheckIn';
import { Customers } from './components/Customers';
import { Rewards } from './components/Rewards';
import { QRGenerator } from './components/QRGenerator';
import { SMS } from './components/SMS';
import { Analytics } from './components/Analytics';
import { ConnectionStatus } from './components/ui/ConnectionStatus';
import { NotificationCenter } from './components/ui/NotificationCenter';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { SMSProvider } from './context/SMSContext';
import { NotificationProvider } from './context/NotificationContext';

export type View = 'dashboard' | 'checkin' | 'customers' | 'rewards' | 'qr' | 'sms' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'checkin':
        return <CheckIn />;
      case 'customers':
        return <Customers />;
      case 'rewards':
        return <Rewards />;
      case 'qr':
        return <QRGenerator />;
      case 'sms':
        return <SMS />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <NotificationProvider>
      <LoyaltyProvider>
        <SMSProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
            <main className="pb-20 md:pb-4 md:pt-20 lg:pt-0 lg:ml-64 transition-all duration-300">
              {renderView()}
            </main>
            <ConnectionStatus />
            <NotificationCenter />
          </div>
        </SMSProvider>
      </LoyaltyProvider>
    </NotificationProvider>
  );
}

export default App;