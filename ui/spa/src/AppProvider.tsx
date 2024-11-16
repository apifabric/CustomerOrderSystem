// AppContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRefresh } from 'react-admin';

// Define a type for the context value
interface AppContextType {
    appId: string;
    setAppId: React.Dispatch<React.SetStateAction<string>>;
    appName: string;
    setAppName: React.Dispatch<React.SetStateAction<string>>;
    appVersion: number;
    setAppVersion: any;
}

// Create a context for the appId and appName
const AppContext = createContext<AppContextType | null>(null);

// Create a provider component
const AppProvider = ({ children }: { children: ReactNode }) => {
    const [appId, setAppId] = useState('');
    const [appName, setAppName] = useState('');
    const [appVersion, setAppVersion2] = useState<number>(0);
    
    const setAppVersion = (value: number) => {
        console.log('setAppVersion', value);
        setAppVersion2(value);
        return value;
    }

    return (
        <AppContext.Provider value={{ appId, setAppId, appName, setAppName, appVersion, setAppVersion }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };