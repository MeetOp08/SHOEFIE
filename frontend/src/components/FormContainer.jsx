import '../styles/FormContainer.css';

const FormContainer = ({ children }) => {
    return (
        <div className="form-container-wrapper">
            <div className="form-container-card card">
                {children}
            </div>
        </div>
    );
};

export default FormContainer;
