const FormContainer = ({ children }) => {
    return (
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md card p-8">
                {children}
            </div>
        </div>
    );
};

export default FormContainer;
