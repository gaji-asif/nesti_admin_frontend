import { useState } from 'react';

export default function AuthTester() {
  const [token, setToken] = useState('');

  const saveToken = () => {
    if (token.trim()) {
      // Store in the same format as your config expects
      localStorage.setItem('nestiAuth', JSON.stringify({ token: token.trim() }));
      alert('Token saved! You can now make authenticated API calls.');
      console.log('Token stored:', token.substring(0, 20) + '...');
    } else {
      alert('Please enter a valid token');
    }
  };

  const clearToken = () => {
    localStorage.removeItem('nestiAuth');
    setToken('');
    alert('Token cleared');
  };

  const checkToken = () => {
    const authData = localStorage.getItem('nestiAuth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        alert(`Token exists: ${parsed.token ? 'Yes' : 'No'}`);
        console.log('Current token:', parsed.token);
      } catch (error) {
        alert('Invalid token format');
      }
    } else {
      alert('No token stored');
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 mb-4">
      <h3 className="text-lg font-semibold mb-2">Auth Tester (Remove in Production)</h3>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste your Postman token here"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="space-x-2">
        <button onClick={saveToken} className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Token
        </button>
        <button onClick={checkToken} className="px-4 py-2 bg-green-500 text-white rounded">
          Check Token
        </button>
        <button onClick={clearToken} className="px-4 py-2 bg-red-500 text-white rounded">
          Clear Token
        </button>
      </div>
    </div>
  );
}