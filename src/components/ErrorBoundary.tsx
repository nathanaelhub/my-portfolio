"use client";

import React from "react";
import { Column, Heading, Text, Button } from "@once-ui-system/core";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Column gap="16" padding="xl" horizontal="center" align="center">
          <Heading variant="heading-strong-m">Something went wrong</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            This content could not be rendered.
          </Text>
          <Button
            variant="secondary"
            size="s"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </Column>
      );
    }

    return this.props.children;
  }
}
