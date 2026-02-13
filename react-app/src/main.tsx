import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { init } from "@neutralinojs/lib"

const appElement = document.getElementById('root');
if (!appElement) {
  throw new Error("App root element not found");
}
const root = createRoot(appElement);

root.render(<App />);

init();
