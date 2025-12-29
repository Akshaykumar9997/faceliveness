import React, { useEffect, useState } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get Session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('sessionId');
    if (id) {
      setSessionId(id);
    }
    setLoading(false);
  }, []);

  const handleAnalysisComplete = async () => {
    // Communicate success to Flutter
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('livenessComplete', 'success');
    } else {
      console.log("Success! (Flutter bridge not found)");
    }
  };

  const handleError = (error) => {
    console.error(error);
    // Optional: Send error to Flutter
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Loader size="large" variation="linear" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div style={styles.container}>
        <h3 style={{ color: 'white', fontFamily: 'sans-serif' }}>Error: Missing Session ID</h3>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {/* CRITICAL: This div forces the liveness check to be full screen 
         and handle mobile safe areas.
      */}
      <div style={styles.fullScreenContainer}>
        <FaceLivenessDetector
          sessionId={sessionId}
          region="ap-south-1" 
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
          disableInstructionScreen={false} // Keep instructions on!
        />
      </div>
    </ThemeProvider>
  );
}

// --- STYLES FOR MOBILE PERFECTION ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
  },
  fullScreenContainer: {
    height: '100vh', 
    width: '100vw',
    backgroundColor: 'black',
    margin: 0,
    padding: 0,
    overflow: 'hidden', // Prevents scrolling
    position: 'absolute',
    top: 0,
    left: 0,
  }
};

export default App;