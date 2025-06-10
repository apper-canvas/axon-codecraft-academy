import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function Button({ children, className = '', onClick, type = 'button', disabled = false, whileHover, whileTap, ...rest }) {
  const commonProps = {
    className: `transition-colors duration-150 ${className}`,
    onClick,
    type,
    disabled,
    ...rest,
  };

  return whileHover || whileTap ? (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      {...commonProps}
    >
      {children}
    </motion.button>
  ) : (
    <button {...commonProps}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Button;