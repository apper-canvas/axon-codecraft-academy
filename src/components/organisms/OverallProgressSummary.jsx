import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import StatisticCard from '@/components/molecules/StatisticCard';

function OverallProgressSummary({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <StatisticCard
        title="Overall Progress"
        value={`${stats.overallProgress}%`}
        iconName="TrendingUp"
        iconColorClass="text-primary"
        bgColorClass="bg-primary/10"
      />
      <StatisticCard
        title="Courses Started"
        value={stats.coursesStarted}
        iconName="BookOpen"
        iconColorClass="text-info"
        bgColorClass="bg-info/10"
      />
      <StatisticCard
        title="Courses Completed"
        value={stats.coursesCompleted}
        iconName="Trophy"
        iconColorClass="text-success"
        bgColorClass="bg-success/10"
      />
      <StatisticCard
        title="Lessons Completed"
        value={`${stats.completedLessons}/${stats.totalLessons}`}
        iconName="CheckCircle"
        iconColorClass="text-warning"
        bgColorClass="bg-warning/10"
      />
    </motion.div>
  );
}

OverallProgressSummary.propTypes = {
  stats: PropTypes.shape({
    totalCourses: PropTypes.number.isRequired,
    coursesStarted: PropTypes.number.isRequired,
    coursesCompleted: PropTypes.number.isRequired,
    totalLessons: PropTypes.number.isRequired,
    completedLessons: PropTypes.number.isRequired,
    overallProgress: PropTypes.number.isRequired,
  }).isRequired,
};

export default OverallProgressSummary;