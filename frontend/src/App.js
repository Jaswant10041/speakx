import React, { useState } from 'react';
import { QueryServiceClient } from './generated/first_grpc_web_pb';
import { SearchRequest } from './generated/first_pb';

const client = new QueryServiceClient('http://localhost:8080');

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const request = new SearchRequest();
        request.setQuery(query);

        client.searchQuery(request, {}, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            setResults(response.getQuestionsList());
        });
    };

    return (
        <div className="App">
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search questions..."
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map(question => (
                    <li key={question.getId()}>
                        <strong>{question.getType()}</strong>: {question.getTitle()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
