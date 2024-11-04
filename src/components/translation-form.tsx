import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LANGUAGES = [
  'American English',
  'Gen Z',
  'Millennial',
  'Hindi',
  'Spanish',
  'French',
  'Boomer',
] as const;

export function TranslationForm() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromLang, setFromLang] = useState<string>(LANGUAGES[0]);
  const [toLang, setToLang] = useState<string>(LANGUAGES[1]);
  const [result, setResult] = useState<{
    translation: string;
    context: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `Translate the following slang or colloquial phrase from ${fromLang} to ${toLang}. Ensure you retain the slang's meaning and tone, providing necessary context.

Phrase: "${input}"

Output format:
1. Translated Phrase: [Provide translation]
2. Context Explanation: [Describe the meaning and context]`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Ollama');
      }

      const data = await response.json();
      const parts = data.response.split('\n');
      
      const translation = parts[0].replace('1. Translated Phrase: ', '').trim();
      const context = parts[1].replace('2. Context Explanation: ', '').trim();

      setResult({ translation, context });
    } catch (error) {
      console.error('Error:', error);
      setError(
        error instanceof Error && error.message === 'Failed to fetch'
          ? 'Unable to connect to Ollama. Please make sure Ollama is running on your computer.'
          : 'An error occurred while translating. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Select
            value={fromLang}
            onValueChange={setFromLang}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={toLang}
            onValueChange={setToLang}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Enter your phrase here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !input.trim() || fromLang === toLang}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Translation</h3>
              <p className="text-lg">{result.translation}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Context</h3>
              <p className="text-muted-foreground">{result.context}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}