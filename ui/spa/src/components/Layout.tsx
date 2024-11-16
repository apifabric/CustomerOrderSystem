import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import HighLight from './sections/HighLight.tsx';
import AIQuery from './sections/AIQuery.tsx';
import SpApp from './SpApp.tsx';
import ErrorBoundary from './ErrorBoundary';
import { AppProvider, useAppContext } from '../AppProvider';

const Layout = () => {
    const hash = document.location.hash;
    // const { appVersion } = useAppContext() || {appVersion: Math.random()};
    // console.log('LayoutAppVersion', appVersion);
    
    if(hash.startsWith("#/dev")) {
        return (
            <AppProvider>
                    <Container 
                            id={"main"} 
                            sx={{ margin: '0px', width: "100%", verticalAlign : "top", 
                                    position: 'absolute', top: 0, left: 0, 
                                    border: "1px solid none"}} 
                            maxWidth={"xl"}>
                    
                        <AIQuery />
                        <ErrorBoundary><HighLight /></ErrorBoundary>
                    </Container>

            </AppProvider>
        );
    }
    if(sessionStorage.getItem('raSpa') === 'true' || document.location.pathname.includes('/spa-dev')) {
        return <SpApp />;
    }
    console.log('NO SPA')
};

export default Layout;