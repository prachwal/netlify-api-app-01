import React from 'react';
import { Button } from '../../components/general/Button';

/**
 * API information interface
 */
interface ApiInfo {
  name: string;
  version: string;
  description: string;
  features: string[];
}

/**
 * Echo response interface
 */
interface EchoResponse {
  originalMessage: string;
  receivedData?: Record<string, unknown>;
}

/**
 * Props for ApiDemoSection component
 */
interface ApiDemoSectionProps {
  /** Hello message from API */
  helloMessage?: string;
  /** Loading state for hello message */
  helloLoading: boolean;
  /** API information data */
  apiInfo?: ApiInfo;
  /** Loading state for API info */
  apiInfoLoading: boolean;
  /** Echo message mutation trigger */
  echoMessage: (args: { message: string; data: Record<string, unknown> }) => void;
  /** Echo response data */
  echoData?: EchoResponse;
  /** Loading state for echo */
  echoLoading: boolean;
  /** Error state for echo */
  echoError?: unknown;
  /** Current message to echo */
  messageToEcho: string;
  /** Handler for message input change */
  onMessageChange: (message: string) => void;
}

/**
 * API Demo section component
 *
 * @remarks
 * Displays API demonstration with hello message, API info, and echo functionality
 *
 * @param props - Component props
 * @returns Rendered API demo section
 */
const ApiDemoSection: React.FC<ApiDemoSectionProps> = ({
  helloMessage,
  helloLoading,
  apiInfo,
  apiInfoLoading,
  echoMessage,
  echoData,
  echoLoading,
  echoError,
  messageToEcho,
  onMessageChange,
}) => {
  /**
   * Handle echo message submission
   */
  const handleEchoSubmit = (): void => {
    if (!messageToEcho.trim()) {
      return; // Don't send empty messages
    }

    echoMessage({
      message: messageToEcho.trim(),
      data: { timestamp: new Date().toISOString() }
    });
  };

  /**
   * Get error message for display
   */
  const getErrorMessage = (): string => {
    if (echoError instanceof Error) {
      return echoError.message;
    }
    return String(echoError);
  };

  return (
    <section className="app__section">
      <div className="card">
        <h2 className="card__title">API Demo with RTK Query</h2>

        {/* Hello Message */}
        <div className="api-section">
          <h3 className="api-section__title">Hello API</h3>

          {helloLoading ? (
            <p className="api-status">Loading hello message...</p>
          ) : helloMessage != null ? (
            <p className="api-response">{helloMessage}</p>
          ) : (
            <p className="api-error">Failed to load hello message</p>
          )}
        </div>

        {/* API Information */}
        <div className="api-section">
          <h3 className="api-section__title">API Information</h3>

          {apiInfoLoading ? (
            <p className="api-status">Loading API info...</p>
          ) : apiInfo ? (
            <div className="api-info">
              <div className="api-info__item">
                <strong>Name:</strong> {apiInfo.name}
              </div>
              <div className="api-info__item">
                <strong>Version:</strong> {apiInfo.version}
              </div>
              <div className="api-info__item">
                <strong>Description:</strong> {apiInfo.description}
              </div>
              <div className="api-info__item">
                <strong>Features:</strong> {apiInfo.features.join(', ')}
              </div>
            </div>
          ) : (
            <p className="api-error">Failed to load API info</p>
          )}
        </div>

        {/* Echo Message Form */}
        <div className="api-section">
          <h3 className="api-section__title">Echo Message</h3>

          <div className="echo-form">
            <input
              type="text"
              value={messageToEcho}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Enter a message to echo"
              className="echo-input"
            />

            <Button
              variant="primary"
              size="small"
              onClick={handleEchoSubmit}
              disabled={echoLoading}
            >
              {echoLoading ? 'Sending...' : 'Send Echo'}
            </Button>
          </div>

          {echoError ? (
            <div className="api-error">
              Error: {getErrorMessage()}
            </div>
          ) : null}

          {echoData && (
            <div className="echo-response">
              <div className="echo-response__item">
                <strong>Original:</strong> {echoData.originalMessage}
              </div>

              {echoData.receivedData != null && (
                <div className="echo-response__item">
                  <strong>Received data:</strong> {JSON.stringify(echoData.receivedData)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { ApiDemoSection };
