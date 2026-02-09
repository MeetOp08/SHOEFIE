import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCategoriesQuery, useGetBrandsQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
        <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm h-fit sticky top-24">
            <h3 className="text-xl font-display font-bold text-accent mb-6 border-b border-border-color pb-4">Refine By</h3>

            {/* Gender Filter (New) */}
            <div className="mb-8">
                <button
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    className="flex justify-between items-center w-full mb-4 text-sm font-bold uppercase tracking-widest text-text-main hover:text-accent transition-colors"
                >
                    <span>Gender</span>
                    {isGenderOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isGenderOpen && (
                    <div className="space-y-2">
                        {['Men', 'Women', 'Kids', 'Unisex'].map((g) => (
                            <div key={g} className="flex items-center group cursor-pointer" onClick={() => handleGenderClick(g)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedGenders.includes(g) ? 'bg-accent border-accent' : 'border-gray-300 group-hover:border-accent'}`}>
                                    {selectedGenders.includes(g) && <div className="w-2 h-2 rounded bg-white"></div>}
                                </div>
                                <span className={`text-sm ${selectedGenders.includes(g) ? 'text-text-main font-bold' : 'text-text-muted group-hover:text-text-main'}`}>
                                    {g}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories */}
            <div className="mb-8">
                <button
                    onClick={() => setIsCatOpen(!isCatOpen)}
                    className="flex justify-between items-center w-full mb-4 text-sm font-bold uppercase tracking-widest text-text-main hover:text-accent transition-colors"
                >
                    <span>Category</span>
                    {isCatOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isCatOpen && (
                    loadingCats ? <Loader /> : (
                        <ul className="space-y-3">
                            {categories?.map((cat) => (
                                <li
                                    key={cat._id}
                                    onClick={() => handleCategoryClick(cat._id)}
                                    className={`cursor-pointer transition-all duration-200 text-sm ${selectedCategory === cat._id ? 'text-accent font-bold pl-2 border-l-2 border-accent' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>

            {/* Brands */}
            <div>
                <button
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                    className="flex justify-between items-center w-full mb-4 text-sm font-bold uppercase tracking-widest text-text-main hover:text-accent transition-colors"
                >
                    <span>Brand</span>
                    {isBrandOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isBrandOpen && (
                    loadingBrands ? <Loader /> : (
                        <div className="space-y-3">
                            {brands?.map((brand) => (
                                <div key={brand._id} className="flex items-center group cursor-pointer" onClick={() => handleBrandChange(brand.name)}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedBrands.includes(brand.name) ? 'bg-accent border-accent' : 'border-gray-300 group-hover:border-accent'}`}>
                                        {selectedBrands.includes(brand.name) && <div className="w-2 h-2 rounded bg-white"></div>}
                                    </div>
                                    <span className={`text-sm ${selectedBrands.includes(brand.name) ? 'text-text-main font-bold' : 'text-text-muted group-hover:text-text-main'}`}>
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
