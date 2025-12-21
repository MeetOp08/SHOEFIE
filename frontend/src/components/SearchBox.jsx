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
        <form onSubmit={submitHandler} className="flex items-center mx-4">
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search Products..."
                className="px-4 py-2 rounded-l-md border-none focus:outline-none text-black"
            />
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-black rounded-r-md hover:bg-yellow-400 font-semibold">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBox;
