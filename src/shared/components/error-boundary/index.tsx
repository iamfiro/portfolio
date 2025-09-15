import { Component, ErrorInfo, ReactNode } from "react";

import { FlexAlign, Typo, VStack } from "../ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <VStack
          gap={24}
          align={FlexAlign.Center}
          style={{
            padding: "2rem",
            textAlign: "center",
            minHeight: "400px",
            justifyContent: "center",
          }}
        >
          <VStack gap={16} align={FlexAlign.Center}>
            <img
              src="/icon/error.png"
              alt="error image"
              width={100}
              height={100}
            />
            <Typo.Headline>⚠️ 오류가 발생했습니다</Typo.Headline>
            <Typo.Body>
              페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시
              시도해주세요.
            </Typo.Body>
            {this.state.error && (
              <details style={{ marginTop: "1rem" }}>
                <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
                  오류 세부사항
                </summary>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: "1rem",
                    borderRadius: "4px",
                    fontSize: "12px",
                    textAlign: "left",
                    overflow: "auto",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}
            {/* <HStack gap={16}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                페이지 새로고침
              </button>
              <button
                onClick={() => window.history.back()}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                이전 페이지
              </button>
            </HStack> */}
          </VStack>
        </VStack>
      );
    }

    return this.props.children;
  }
}
