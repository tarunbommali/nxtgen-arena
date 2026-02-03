import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  GitBranch, 
  Code, 
  Network, 
  Container, 
  Cloud, 
  Code2,
  Filter,
  Search,
  Star,
  Target,
  BookOpen
} from 'lucide-react';
import Navbar from '../Navbar';
import Breadcrumb from '../shared/Breadcrumb';
import challengesData from '../../data/challenges30Days.json';

const iconMap = {
  'git-branch': GitBranch,
  'code': Code,
  'network': Network,
  'container': Container,
  'cloud': Cloud,
  'code2': Code2
};

const difficultyColors = {
  'Beginner': 'text-green-400 bg-green-400/10',
  'Intermediate': 'text-yellow-400 bg-yellow-400/10',
  'Advanced': 'text-red-400 bg-red-400/10'
};

const categoryColors = {
  'DevOps': 'text-blue-400 bg-blue-400/10',
  'Computer Science': 'text-purple-400 bg-purple-400/10',
  'Cloud Computing': 'text-orange-400 bg-orange-400/10',
  'Web Development': 'text-pink-400 bg-pink-400/10',
  'Programming': 'text-green-400 bg-green-400/10'
};

export default function ChallengesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...new Set(challengesData.challenges.map(c => c.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredChallenges = challengesData.challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                30-Day Challenges
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your skills with intensive 30-day learning challenges. 
              Master new technologies through daily tasks, projects, and hands-on practice.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{challengesData.challenges.length}</div>
                <div className="text-sm text-muted-foreground">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">30</div>
                <div className="text-sm text-muted-foreground">Days Each</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">900+</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb 
          items={[
            { label: '30-Day Challenges' }
          ]} 
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-background">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-background">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => {
            const IconComponent = iconMap[challenge.icon] || Code;
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <div className="h-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${challenge.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[challenge.category]}`}>
                        {challenge.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{challenge.totalDays} Days</span>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-1">
                      {challenge.prerequisites.slice(0, 2).map((prereq, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs">
                          {prereq}
                        </span>
                      ))}
                      {challenge.prerequisites.length > 2 && (
                        <span className="px-2 py-1 bg-white/5 rounded text-xs">
                          +{challenge.prerequisites.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium group-hover:underline">
                      Start Challenge →
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs">4.8</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}