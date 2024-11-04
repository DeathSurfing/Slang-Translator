# Slang Translator

## Project Overview
The **Slang Translator** is a real-time translation tool designed to capture the nuances of slang, colloquialisms, and informal language across different regions and contexts. This tool translates slang phrases while preserving the original tone and provides context to help users understand cultural or regional differences in language use.

## Features
- **Real-Time Translation**: Translates slang and informal phrases to standard language, maintaining their intended tone.
- **Contextual Explanations**: Each translation includes a brief explanation of the slang's meaning and where it's commonly used.
- **Region-Specific Variations**: Customizable for translating slang from various regions (e.g., British English, American English).

## Requirements
- **Ollama**: Install and run Ollama to handle the translation model.
- **LLaMA 3.1 (7B)**: This project requires LLaMA 3.1 (7B) to be installed and running on Ollama. Ensure that the model is downloaded and accessible for efficient translation.

## Installation

1. **Install Ollama**
   - Follow the installation guide for [Ollama](https://ollama.com) to set up the environment on your machine.

2. **Download LLaMA 3.1 (7B)**
   - Once Ollama is set up, download the LLaMA 3.1 (7B) model:
   ```bash
   ollama pull llama-3.1-7b
   ```

3. **Run Ollama**
   - Start the Ollama service with LLaMA 3.1 (7B):
   ```bash
   ollama run llama-3.1-7b
   ```

## Usage

1. **Start Ollama with the Required Model**
   - Ensure Ollama is running with the LLaMA 3.1 (7B) model before starting the application.

2. **Launch the Web UI**
   - This project uses a **Next.js** web interface for user interactions.
   - To start the Next.js server, navigate to the project directory and run:
   ```bash
   npm install
   npm run dev
   ```
   - Open http://localhost:3000 in your browser to access the Slang Translator UI.

3. **Enter Slang Phrases**
   - Use the web interface to enter slang terms or phrases you want translated.

4. **Receive Translations and Explanations**
   - The app will display both the translated phrase and a context explanation for better understanding.

## Example Usage

**Input:**
```plaintext
Translate the slang phrase: "I'm feeling chuffed."
```

**Output:**
```plaintext
1. Translated Phrase: "I'm feeling really happy/proud."
2. Context Explanation: "'Chuffed' is British slang meaning to be pleased or proud, often in response to an achievement."
```

## Troubleshooting

- **Model Not Found**: Ensure you've installed LLaMA 3.1 (7B) and have it running on Ollama.
- **Slow Performance**: Running large models can be memory-intensive. Consider upgrading hardware or optimizing prompts for faster processing.

## License
This project is licensed under the MIT License. See `LICENSE` for more details.
