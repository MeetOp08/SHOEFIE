import { useState } from 'react';
import { useGetCategoriesQuery, useGetBrandsQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterSidebar = ({ setCategoryFilter, setBrandFilter }) => {
    const { data: categories, isLoading: loadingCats } = useGetCategoriesQuery();
    const { data: brands, isLoading: loadingBrands } = useGetBrandsQuery();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);

    // Collapsible states
    const [isCatOpen, setIsCatOpen] = useState(true);
    const [isBrandOpen, setIsBrandOpen] = useState(true);

    const handleCategoryClick = (catId) => {
        if (selectedCategory === catId) {
            setSelectedCategory('');
            setCategoryFilter('');
        } else {
            setSelectedCategory(catId);
            setCategoryFilter(catId);
        }
    };

    const handleBrandChange = (brandName) => {
        const newBrands = selectedBrands.includes(brandName)
            ? selectedBrands.filter((name) => name !== brandName)
            : [...selectedBrands, brandName];

        setSelectedBrands(newBrands);
        setBrandFilter(newBrands.join(','));
    };

    return (
        <div className="bg-secondary p-6 border border-gray-800 h-fit sticky top-24">
            <h3 className="text-xl font-display font-bold text-white mb-8 border-b border-gray-800 pb-4">Refine By</h3>

            {/* Categories */}
            <div className="mb-8">
                <button
                    onClick={() => setIsCatOpen(!isCatOpen)}
                    className="flex justify-between items-center w-full mb-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white"
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
                                    className={`cursor-pointer transition-all duration-200 text-sm ${selectedCategory === cat._id ? 'text-accent font-bold pl-2 border-l-2 border-accent' : 'text-gray-500 hover:text-gray-300'}`}
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
                    className="flex justify-between items-center w-full mb-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                >
                    <span>Brand</span>
                    {isBrandOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isBrandOpen && (
                    loadingBrands ? <Loader /> : (
                        <div className="space-y-3">
                            {brands?.map((brand) => (
                                <div key={brand._id} className="flex items-center group cursor-pointer" onClick={() => handleBrandChange(brand.name)}>
                                    <div className={`w-4 h-4 border flex items-center justify-center mr-3 transition-colors ${selectedBrands.includes(brand.name) ? 'bg-accent border-accent' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                        {selectedBrands.includes(brand.name) && <div className="w-2 h-2 bg-black"></div>}
                                    </div>
                                    <span className={`text-sm ${selectedBrands.includes(brand.name) ? 'text-white font-bold' : 'text-gray-500 group-hover:text-gray-300'}`}>
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
