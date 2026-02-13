import { LoaderContextProvider } from './contexts/LoaderContext';
import { Router } from './Router';

export type SQLCommand = {
  NomeSQL: string;
  OBS: string;
  SQL: string;
};

export function App() {

  return (
    <LoaderContextProvider>
      <Router />
    </LoaderContextProvider>
  );
}
