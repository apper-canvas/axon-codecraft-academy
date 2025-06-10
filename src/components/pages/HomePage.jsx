import HeroSection from '@/components/organisms/HeroSection';
import LanguageSection from '@/components/organisms/LanguageSection';
import FeaturesSection from '@/components/organisms/FeaturesSection';
import CtaSection from '@/components/organisms/CtaSection';

function HomePage() {
  const featuresData = [
    {
      icon: 'Code',
      title: 'Interactive Lessons',
      description: 'Learn by doing with hands-on coding exercises and real-time feedback.'
    },
    {
      icon: 'Zap',
      title: 'Instant Feedback',
      description: 'See your code run immediately with syntax highlighting and error detection.'
    },
    {
      icon: 'Target',
      title: 'Structured Learning',
      description: 'Follow carefully crafted courses that build your skills step by step.'
    },
    {
      icon: 'Trophy',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and achievements.'
    }
  ];

  const languagesData = [
    { name: 'Python', icon: 'FileText', color: 'bg-blue-100 text-blue-600' },
    { name: 'JavaScript', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Java', icon: 'Coffee', color: 'bg-red-100 text-red-600' }
  ];

  return (
    <div className="min-h-full bg-background">
      <HeroSection
        title="Master Programming"
        highlightedTitle="One Lesson at a Time"
        description="Learn to code with interactive lessons, hands-on projects, and instant feedback. Build real skills with our comprehensive programming courses."
        primaryButtonLabel="Start Learning Now"
        primaryButtonAction="/courses"
        secondaryButtonLabel="View My Progress"
        secondaryButtonAction="/progress"
      />

      <LanguageSection
        title="Learn Popular Programming Languages"
        description="Choose from our comprehensive courses designed for all skill levels"
        languages={languagesData}
      />

      <FeaturesSection
        title="Why Choose CodeCraft Academy?"
        description="Our platform is designed to make learning programming effective and enjoyable"
        features={featuresData}
      />

      <CtaSection
        title="Ready to Start Your Coding Journey?"
        description="Join thousands of learners who have successfully mastered programming with CodeCraft Academy"
        buttonLabel="Browse Courses"
        buttonAction="/courses"
      />
    </div>
  );
}

export default HomePage;