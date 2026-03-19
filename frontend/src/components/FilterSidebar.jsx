import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCategoriesQuery, useGetBrandsQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/FilterSidebar.css';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read from URL
    const categoryParam = searchParams.get('category') || '';
    const brandParam = searchParams.get('brand') || '';
    const genderParam = searchParams.get('gender') || '';

    const { data: categories, isLoading: loadingCats } = useGetCategoriesQuery();
    const { data: brands, isLoading: loadingBrands } = useGetBrandsQuery();

    // Local state for UI only (collapsed sections)
    const [isCatOpen, setIsCatOpen] = useState(true);
    const [isBrandOpen, setIsBrandOpen] = useState(true);
    const [isGenderOpen, setIsGenderOpen] = useState(true);

    // Helpers to update URL
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('pageNumber', '1'); // Reset to page 1 on filter change
        setSearchParams(newParams);
    };

    const handleCategoryClick = (catId) => {
        updateFilter('category', categoryParam === catId ? '' : catId);
    };

    const handleGenderClick = (gender) => {
        // Toggle gender (single select for simplicity based on typically mutually exclusive in this context, or multi if needed. User ex: ?gender=Men)
        // Let's support multi-select for gender if using checkboxes, but click usually implies single or toggle.
        // User example was ?gender=Men. Let's stick to single select or toggle for now, matching the requested style.
        // If I implement multi-select logic like brands:
        let currentGenders = genderParam ? genderParam.split(',') : [];
        if (currentGenders.includes(gender)) {
            currentGenders = currentGenders.filter(g => g !== gender);
        } else {
            currentGenders.push(gender);
        }
        updateFilter('gender', currentGenders.join(','));
    };

    const handleBrandChange = (brandName) => {
        let currentBrands = brandParam ? brandParam.split(',') : [];
        if (currentBrands.includes(brandName)) {
            currentBrands = currentBrands.filter(b => b !== brandName);
        } else {
            currentBrands.push(brandName);
        }
        updateFilter('brand', currentBrands.join(','));
    };

    // Derived state for UI
    const selectedCategory = categoryParam;
    const selectedBrands = brandParam ? brandParam.split(',') : [];
    const selectedGenders = genderParam ? genderParam.split(',') : [];

    return (
        <div className="filter-sidebar-container">
            <h3 className="filter-title">Refine By</h3>

            {/* Gender Filter (New) */}
            <div className="filter-section">
                <button
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    className="filter-header"
                >
                    <span>Gender</span>
                    {isGenderOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isGenderOpen && (
                    <div className="filter-list">
                        {['Men', 'Women', 'Kids', 'Unisex'].map((g) => (
                            <div key={g} className="filter-checkbox-label" onClick={() => handleGenderClick(g)}>
                                <div className={`filter-checkbox-box ${selectedGenders.includes(g) ? 'checked' : ''}`}>
                                    {selectedGenders.includes(g) && <div className="filter-checkbox-inner"></div>}
                                </div>
                                <span className={`filter-checkbox-text ${selectedGenders.includes(g) ? 'checked' : ''}`}>
                                    {g}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories */}
            <div className="filter-section">
                <button
                    onClick={() => setIsCatOpen(!isCatOpen)}
                    className="filter-header"
                >
                    <span>Category</span>
                    {isCatOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isCatOpen && (
                    loadingCats ? <Loader /> : (
                        <ul className="filter-list-gap-3">
                            {categories?.map((cat) => (
                                <li
                                    key={cat._id}
                                    onClick={() => handleCategoryClick(cat._id)}
                                    className={`filter-category-item ${selectedCategory === cat._id ? 'active' : ''}`}
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>

            {/* Brands */}
            <div className="filter-section">
                <button
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                    className="filter-header"
                >
                    <span>Brand</span>
                    {isBrandOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isBrandOpen && (
                    loadingBrands ? <Loader /> : (
                        <div className="filter-list-gap-3">
                            {brands?.map((brand) => (
                                <div key={brand._id} className="filter-checkbox-label" onClick={() => handleBrandChange(brand.name)}>
                                    <div className={`filter-checkbox-box ${selectedBrands.includes(brand.name) ? 'checked' : ''}`}>
                                        {selectedBrands.includes(brand.name) && <div className="filter-checkbox-inner"></div>}
                                    </div>
                                    <span className={`filter-checkbox-text ${selectedBrands.includes(brand.name) ? 'checked' : ''}`}>
                                        {brand.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;
