import { Container, Row, Col } from 'react-bootstrap'; // Wait, I am using Tailwind, not Bootstrap. I should rewrite this for Tailwind.

const FormContainer = ({ children }) => {
    return (
        <div className='container mx-auto mt-10'>
            <div className='flex justify-center'>
                <div className='w-full md:w-1/2'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FormContainer;
