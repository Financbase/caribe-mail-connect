// Comprehensive retry mechanisms for failed operations
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
  onRetry?: (attempt: number, error: Error) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    'NetworkError',
    'TimeoutError',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND'
  ]
};

export class RetryManager {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async execute<T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.config, ...customConfig };
    const startTime = Date.now();
    let lastError: Error;

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        const result = await operation();
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime
        };
      } catch (error) {
        lastError = error as Error;
        
        // Check if error is retryable
        if (!this.isRetryableError(error as Error, finalConfig)) {
          return {
            success: false,
            error: lastError,
            attempts: attempt,
            totalTime: Date.now() - startTime
          };
        }

        // Call onRetry callback
        if (finalConfig.onRetry) {
          finalConfig.onRetry(attempt, lastError);
        }

        // If this is the last attempt, don't wait
        if (attempt === finalConfig.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt, finalConfig);
        await this.sleep(delay);
      }
    }

    // Call onMaxAttemptsReached callback
    if (finalConfig.onMaxAttemptsReached) {
      finalConfig.onMaxAttemptsReached(lastError!);
    }

    return {
      success: false,
      error: lastError!,
      attempts: finalConfig.maxAttempts,
      totalTime: Date.now() - startTime
    };
  }

  private isRetryableError(error: Error, config: RetryConfig): boolean {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();
    
    return config.retryableErrors.some(retryableError => 
      errorMessage.includes(retryableError.toLowerCase()) ||
      errorName.includes(retryableError.toLowerCase())
    );
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    return Math.min(delay, config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Specialized retry managers for different use cases
export class NetworkRetryManager extends RetryManager {
  constructor() {
    super({
      maxAttempts: 5,
      baseDelay: 500,
      maxDelay: 5000,
      retryableErrors: [
        'NetworkError',
        'ECONNRESET',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'ENOTFOUND',
        'fetch failed',
        'network timeout'
      ]
    });
  }
}

export class DatabaseRetryManager extends RetryManager {
  constructor() {
    super({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      retryableErrors: [
        'ConnectionError',
        'QueryError',
        'TransactionError',
        'ECONNRESET',
        'ECONNREFUSED'
      ]
    });
  }
}

export class APIRetryManager extends RetryManager {
  constructor() {
    super({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 8000,
      retryableErrors: [
        '500',
        '502',
        '503',
        '504',
        'NetworkError',
        'TimeoutError'
      ]
    });
  }
}

// Utility functions for common retry patterns
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  const retryManager = new RetryManager({ maxAttempts, baseDelay });
  const result = await retryManager.execute(operation);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data!;
}

export async function retryNetworkRequest<T>(
  request: () => Promise<T>
): Promise<T> {
  const retryManager = new NetworkRetryManager();
  const result = await retryManager.execute(request);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data!;
}

export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  const retryManager = new DatabaseRetryManager();
  const result = await retryManager.execute(operation);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data!;
}

// React Hook for retry operations
export function useRetry() {
  const retryManager = new RetryManager();
  
  const retry = async <T>(
    operation: () => Promise<T>,
    config?: Partial<RetryConfig>
  ): Promise<RetryResult<T>> => {
    return retryManager.execute(operation, config);
  };

  return { retry };
}

// Circuit breaker pattern for preventing cascading failures
export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly successThreshold: number;

  constructor(
    failureThreshold: number = 5,
    resetTimeout: number = 60000,
    successThreshold: number = 2
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.successThreshold = successThreshold;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
} 