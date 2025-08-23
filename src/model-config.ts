// Model configuration for OpenAI API
export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  costPer1kTokens: number;
  maxTokens: number;
  capabilities: string[];
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast & cost-effective for most tasks',
    costPer1kTokens: 0.00015, // $0.15 per 1M tokens
    maxTokens: 128000,
    capabilities: ['Text generation', 'Analysis', 'Fast response']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Highest quality for complex analysis',
    costPer1kTokens: 0.005, // $5.00 per 1M tokens
    maxTokens: 128000,
    capabilities: ['Text generation', 'Analysis', 'High quality', 'Reasoning']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Budget option for simple tasks',
    costPer1kTokens: 0.0005, // $0.50 per 1M tokens
    maxTokens: 16385,
    capabilities: ['Text generation', 'Basic analysis', 'Cost-effective']
  }
];

export function getModelInfo(modelId: string): ModelConfig | undefined {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
}

export function getDefaultModel(): string {
  return 'gpt-4o-mini';
}

export function validateModel(modelId: string): boolean {
  return AVAILABLE_MODELS.some(model => model.id === modelId);
}

export function getModelComparison(): string {
  return AVAILABLE_MODELS.map(model => 
    `• \`${model.id}\` - ${model.description} ($${(model.costPer1kTokens * 1000).toFixed(3)}/1K tokens)`
  ).join('\n');
}
