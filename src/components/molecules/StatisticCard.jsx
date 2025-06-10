import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

function StatisticCard({ title, value, iconName, iconColorClass, bgColorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-2xl font-bold text-secondary">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColorClass}`}>
          <ApperIcon name={iconName} className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
    </div>
  );
}

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconName: PropTypes.string.isRequired,
  iconColorClass: PropTypes.string.isRequired,
  bgColorClass: PropTypes.string.isRequired,
};

export default StatisticCard;