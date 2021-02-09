import MemeGenerator from './components/MemeGeneratorComponent';
import Header from './components/HeaderComponent';
import loadSztahanovaTheme from './theme';
import { Stack } from '@fluentui/react';
import Footer from './components/FooterComponent';

loadSztahanovaTheme();

function App() {
  return (
    <Stack className="App">
      <Header />
      <MemeGenerator />
      <Footer />
    </Stack>
  );
}

export default App;
