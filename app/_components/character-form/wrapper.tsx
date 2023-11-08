
interface FormWrapperProps {
  children: React.ReactNode;
  name: string;
  error?: string;
}

const FormWrapper = ({ children, name, error }: FormWrapperProps) => {
  return (
    <div className="form-control w-full md:mb-2">
      <label className="label gap-4">
        <span className="label-text">{name}</span>
      </label>
      {children}
      {error && <span className="text-error">{error}</span>}
    </div>
  );
};

export default FormWrapper;
