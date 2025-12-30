import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#F8F5F2',
                    color: '#1E4A35',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <p style={{ marginBottom: '2rem', color: '#666' }}>
                        We're sorry, but the application encountered an unexpected error.<br />
                        (हमें खेद है, एप्लिकेशन में एक त्रुटि हुई है।)
                    </p>
                    <details style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem', color: '#d32f2f' }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => window.history.back()}
                            style={{
                                padding: '0.8rem 2rem',
                                backgroundColor: '#fff',
                                color: '#1E4A35',
                                border: '1px solid #1E4A35',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            ← Go Back
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.8rem 2rem',
                                backgroundColor: '#1E4A35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh Page (पेज रिफ्रेश करें)
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                padding: '0.8rem 2rem',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
