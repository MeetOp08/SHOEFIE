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
            // Keep the keyword in the box
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex items-center w-full max-w-md relative group">
            <div className="absolute left-4 text-gray-400 group-focus-within:text-accent transition-colors pointer-events-none">
                <FaSearch />
            </div>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search..."
                className="w-full bg-secondary/50 border border-transparent rounded-full py-2.5 pl-10 pr-4 text-text-main text-sm focus:outline-none focus:bg-white focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all placeholder-gray-500"
            />
        </form>
    );
};

export default SearchBox;
