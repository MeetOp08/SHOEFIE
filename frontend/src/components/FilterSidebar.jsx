import { useState } from 'react';
import { useGetCategoriesQuery, useGetBrandsQuery } from '../slices/productsApiSlice';
import Loader from './Loader';

const FilterSidebar = ({ setCategoryFilter, setBrandFilter }) => {
    const { data: categories, isLoading: loadingCats } = useGetCategoriesQuery();
    const { data: brands, isLoading: loadingBrands } = useGetBrandsQuery();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);

    const handleCategoryClick = (catId) => {
        if (selectedCategory === catId) {
            setSelectedCategory('');
            setCategoryFilter('');
        } else {
            setSelectedCategory(catId);
            setCategoryFilter(catId);
        }
    };

    const handleBrandChange = (brandId) => {
        const newBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter((id) => id !== brandId)
            : [...selectedBrands, brandId];

        setSelectedBrands(newBrands);
        setBrandFilter(newBrands.join(',')); // Simple comma-sep string for now, or array logic in controller
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg h-fit sticky top-4">
            <h3 className="text-xl font-bold text-white mb-4">Filters</h3>

            <div className="mb-6">
                <h4 className="text-lg font-semibold text-accent mb-2">Categories</h4>
                {loadingCats ? <Loader /> : (
                    <ul className="space-y-2">
                        {categories?.map((cat) => (
                            <li
                                key={cat._id}
                                onClick={() => handleCategoryClick(cat._id)}
                                className={`cursor-pointer hover:text-accent transition-colors ${selectedCategory === cat._id ? 'text-accent font-bold' : 'text-gray-300'}`}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <h4 className="text-lg font-semibold text-accent mb-2">Brands</h4>
                {loadingBrands ? <Loader /> : (
                    <div className="space-y-2">
                        {brands?.map((brand) => (
                            <div key={brand._id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={brand._id}
                                    checked={selectedBrands.includes(brand._id)}
                                    onChange={() => handleBrandChange(brand._id)}
                                    className="mr-2 rounded text-accent focus:ring-accent bg-gray-700 border-gray-600"
                                />
                                <label htmlFor={brand._id} className="text-gray-300 cursor-pointer select-none">
                                    {brand.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;
