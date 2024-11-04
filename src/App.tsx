import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { TranslationForm } from '@/components/translation-form';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <span className="text-xl font-semibold">Slang Translator</span>
            <ModeToggle />
          </div>
        </header>

        <main className="container py-12">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Slang Translator</h1>
              <p className="text-lg text-muted-foreground">
                Transform American slang into standard English with context and meaning.
              </p>
            </div>
            <TranslationForm />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;