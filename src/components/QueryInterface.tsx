'use client';

import { useState } from 'react';
import { Search, Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface QueryResult {
  success: boolean;
  naturalLanguageQuery: string;
  generatedSQL: string;
  results: Record<string, unknown>[];
  count: number;
  explanation?: string;
  error?: string;
  details?: string;
}

export default function QueryInterface() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        naturalLanguageQuery: query,
        generatedSQL: '',
        results: [],
        count: 0,
        error: 'Network error',
        details: 'Failed to connect to the server',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data: Record<string, unknown>[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No results found.
        </div>
      );
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column] !== null && row[column] !== undefined
                      ? String(row[column])
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const exampleQueries = [
    'Show all users',
    'Find products under $100',
    'Show completed orders',
    'Find users from New York',
    'Show products in Electronics category',
    'Find orders with total over $500',
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Database className="w-8 h-8 text-blue-600" />
          Natural Language to SQL
        </h1>
        <p className="text-gray-600">
          Type your question in plain English and get SQL results
        </p>
      </div>

      {/* Query Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your data..."
              className="w-full text-gray-900 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Execute Query
              </>
            )}
          </button>
        </form>

        {/* Example Queries */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Try these example queries:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-xl font-semibold">
              {result.success ? 'Query Results' : 'Error'}
            </h2>
          </div>

          {result.success ? (
            <div className="space-y-4">
              {/* AI Explanation */}
              {result.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        AI Assistant Response
                      </h3>
                      <div className="text-sm text-blue-700 leading-relaxed">
                        {result.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated SQL - now collapsed by default */}
              <details className="bg-gray-50 rounded-lg p-4">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                  View Generated SQL Query ({result.count} result{result.count !== 1 ? 's' : ''})
                </summary>
                <div className="mt-2">
                  <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded">
                    {result.generatedSQL}
                  </code>
                </div>
              </details>

              {/* Results Table - now in a collapsible section */}
              <details className="border rounded-lg overflow-hidden">
                <summary className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 border-b">
                  View Raw Data Table
                </summary>
                <div className="bg-white">
                  {renderTable(result.results)}
                </div>
              </details>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-red-600 font-medium">
                {result.error}
              </div>
              {result.details && (
                <div className="text-sm text-gray-600">
                  {result.details}
                </div>
              )}
              {result.generatedSQL && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Generated SQL:
                  </h3>
                  <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded">
                    {result.generatedSQL}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 