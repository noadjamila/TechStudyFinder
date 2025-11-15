import React from 'react';
import Button from './components/Button';

const App: React.FC = () => {
    return (
        <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}> {/* Set light gray background */}
            <div style={{ padding: '20px' }}>
                <h1>Welcome to my Project!</h1>
                <Button />
            </div>
        </div>
    );
};

export default App;
