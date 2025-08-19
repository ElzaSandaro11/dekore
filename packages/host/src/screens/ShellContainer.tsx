import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Placeholder from '../components/Placeholder';

const Shell = React.lazy(() => import('shell/App'));

const ShellContainer = () => {
  return (
    <ErrorBoundary name="ShellContainer">
      <React.Suspense fallback={<Placeholder label="Dekore" icon="circle" />}>
        <Shell />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default ShellContainer;
