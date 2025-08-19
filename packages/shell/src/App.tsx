import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import RNBootSplash from 'react-native-bootsplash';
import {Text} from 'react-native';
import {PaperProvider} from 'react-native-paper';

const AuthProvider = React.lazy(() => import('auth/AuthProvider'));
const SignInScreen = React.lazy(() => import('auth/SignInScreen'));

const App = () => {
  // return <Text>Hello</Text>;
  return (
    <PaperProvider>
      <ErrorBoundary name="shell">
        <React.Suspense fallback={<SplashScreen />}>
          <AuthProvider>
            {(authData: {isSignout: boolean; isLoading: boolean}) => {
              if (authData.isLoading) {
                return <SplashScreen />;
              }

              if (authData.isSignout) {
                return (
                  <React.Suspense fallback={<SplashScreen />}>
                    <SignInScreen />
                  </React.Suspense>
                );
              }
              // return <Text>Hello</Text>;
              return <MainNavigator />;
            }}
          </AuthProvider>
        </React.Suspense>
      </ErrorBoundary>
    </PaperProvider>
  );
};

export default App;
