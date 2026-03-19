import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBox.css';

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
        <form onSubmit={submitHandler} className="search-form">
            <div className="search-icon-wrapper">
                <FaSearch />
            </div>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search..."
                className="search-input"
            />
        </form>
    );
};

export default SearchBox;
