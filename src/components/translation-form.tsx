import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react'; // Ensure you have this library installed
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

const MODELS = [
  'llama3.1:latest',
  'mistral:latest',
  'falcon-40b',
] as const;

export function TranslationForm() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromLang, setFromLang] = useState<string>(LANGUAGES[0]);
  const [toLang, setToLang] = useState<string>(LANGUAGES[1]);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0]);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: `Be Precise. You are very smart. Translate the following text or colloquial phrase from ${fromLang} to ${toLang}. Ensure you retain the slang's meaning and tone, providing necessary context.

          Phrase: "${input}"

          Output format:
          1. Translated Phrase: [Provide translation]
          2. Context Explanation: [Describe the meaning and context]`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.response) {
        setApiResponse(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(
          error.message.includes('Failed to fetch')
            ? 'Unable to connect to Ollama. Please make sure Ollama is running on your computer.'
            : error.message
        );
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const parseResponse = (responseText: string) => {
    const translationMatch = responseText.match(/\*\*Translated Phrase:\*\*(.*?)(?=\n|$)/);
    const translation = translationMatch ? translationMatch[1].trim() : null;
    const contextMatch = responseText.match(/\*\*Context Explanation:\*\*(.*?)(?=\n|$)/s);
    const context = contextMatch ? contextMatch[1].trim() : null;

    return {
      translation: translation || 'Translation not found',
      context: context || 'Context not found',
    };
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Select value={fromLang} onValueChange={setFromLang} disabled={loading}>
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

          <Select value={toLang} onValueChange={setToLang} disabled={loading}>
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

        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={loading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {apiResponse && apiResponse.response && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Translation</h3>
              <p className="text-lg">{parseResponse(apiResponse.response).translation}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Context</h3>
              <p className="text-muted-foreground">
                {parseResponse(apiResponse.response).context}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Details</h3>
              <p className="text-muted-foreground">Model: {apiResponse.model}</p>
              <p className="text-muted-foreground">
                Created: {new Date(apiResponse.created_at).toLocaleString()}
              </p>
              <p className="text-muted-foreground">
                Processing time: {(apiResponse.total_duration / 1e9).toFixed(2)}s
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TranslationForm;