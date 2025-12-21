import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
            setKeyword('');
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex items-center w-full relative">
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search for premium footwear..."
                className="w-full bg-gray-dark/50 border border-gray-600 rounded-full py-2 pl-4 pr-12 text-gray-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-gray-500"
            />
            <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-accent text-primary rounded-full hover:bg-yellow-500 transition-colors">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBox;
