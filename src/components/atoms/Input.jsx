import PropTypes from 'prop-types';

function Input({ type = 'text', value, onChange, placeholder, className = '', icon: Icon, ...rest }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${Icon ? 'pl-10' : ''} ${className}`}
        {...rest}
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType, // For ApperIcon component
};

export default Input;