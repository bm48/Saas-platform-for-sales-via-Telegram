import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Ranking from './pages/Ranking';
import Statistics from './pages/Statistics';
import CreateBot from './pages/CreateBot';
import ConfigureBot from './pages/ConfigureBot';
import Mailing from './pages/Mailing';
import Tracking from './pages/Tracking';
import Redirectors from './pages/Redirectors';
import Payments from './pages/Payments';
import MyAccount from './pages/MyAccount';
import Support from './pages/Support';

export type Page = 
  | 'dashboard' 
  | 'ranking' 
  | 'statistics' 
  | 'createBot' 
  | 'configureBot' 
  | 'mailing' 
  | 'tracking' 
  | 'redirectors' 
  | 'payments' 
  | 'myAccount' 
  | 'support';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'ranking':
        return <Ranking />;
      case 'statistics':
        return <Statistics />;
      case 'createBot':
        return <CreateBot />;
      case 'configureBot':
        return <ConfigureBot />;
      case 'mailing':
        return <Mailing />;
      case 'tracking':
        return <Tracking />;
      case 'redirectors':
        return <Redirectors />;
      case 'payments':
        return <Payments />;
      case 'myAccount':
        return <MyAccount />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 lg:ml-64">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;