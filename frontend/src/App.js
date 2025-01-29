import React, { useState } from 'react';
import { QueryServiceClient } from './generated/first_grpc_web_pb';
import { SearchRequest } from './generated/first_pb';


const client = new QueryServiceClient('http://localhost:8080');

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = (newPage = 1) => {
        setPage(newPage);
        const request = new SearchRequest();
        request.setQuery(query);
        request.setPage(newPage);
        request.setLimit(limit);

        client.searchQuery(request, {}, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            setResults(response.getQuestionsList());
            const totalQuestions = response.u[1]; // Ensure this works
            setTotalPages(Math.ceil(totalQuestions / limit));
        });
    };

    const handlePrevious = () => {
        if (page > 1) {
            handleSearch(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            handleSearch(page + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="p-6 max-w-xl w-full bg-gray-800 rounded-xl shadow-md space-y-4">
                <div className="mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search questions..."
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => handleSearch(1)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Search
                </button>
                <ul className="space-y-2">
                    {results.map((question) => (
                        <li key={question.getId()} className="border-b border-gray-700 pb-2">
                            <strong className="text-indigo-400">{question.getType()}</strong>: {question.getTitle()}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={page === 1}
                        className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-white">Page {page} of {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
