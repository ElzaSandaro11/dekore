import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import ShellContainer from './screens/ShellContainer';

const App = () => {
  return (
    <ErrorBoundary name="AuthProvider">
      <React.Suspense fallback={<SplashScreen />}>
        <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
          <ShellContainer />
        </NavigationContainer>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default App;
