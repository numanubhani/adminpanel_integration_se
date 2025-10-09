import React from 'react';

const ContributorsTable = ({ contributors, currentPage, totalPages }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Contributors</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-64"
            />
            <svg 
              className="absolute left-3 top-2.5 text-gray-400" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <button className="p-2 border border-gray-300 rounded">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
          <button className="p-2 border border-gray-300 rounded">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="border border-blue-200 rounded-lg overflow-hidden">
        <div className="bg-blue-900 text-white grid grid-cols-6 py-4 px-4">
          <div>Content Creator</div>
          <div className="text-center">Contents</div>
          <div className="text-center">Votes</div>
          <div className="text-center">Contests Joined</div>
          <div className="text-center">Contests Win</div>
          <div className="text-center">Badges Earned</div>
        </div>
        
        {contributors.map((contributor, index) => (
          <div 
            key={contributor.id} 
            className={`grid grid-cols-6 py-3 px-4 items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <img 
                src={contributor.image || "/api/placeholder/40/40"} 
                alt={contributor.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{contributor.name}</span>
            </div>
            <div className="text-center">{contributor.contents}</div>
            <div className="text-center">{contributor.votes}</div>
            <div className="text-center">{contributor.contestsJoined}</div>
            <div className="text-center">{contributor.contestsWin}</div>
            <div className="text-center">{contributor.badgesEarned}</div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div>Page {currentPage} of {totalPages}</div>
        <button className="px-4 py-1 border border-gray-300 rounded flex items-center gap-1">
          Next
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Example usage with sample data
export default function ContributorsTableExample() {
  const sampleContributors = [
    {
      id: 1,
      name: "John Doe",
      image: "/api/placeholder/40/40",
      contents: 234,
      votes: 410,
      contestsJoined: 500,
      contestsWin: 200,
      badgesEarned: 200
    },
    {
      id: 2,
      name: "Alina Batosh",
      image: "/api/placeholder/40/40",
      contents: 72,
      votes: 290,
      contestsJoined: 490,
      contestsWin: 170,
      badgesEarned: 170
    },
    {
      id: 3,
      name: "Zand Yoder",
      image: "/api/placeholder/40/40",
      contents: 48,
      votes: 400,
      contestsJoined: 470,
      contestsWin: 300,
      badgesEarned: 300
    },
    {
      id: 4,
      name: "Devid Kim",
      image: "/api/placeholder/40/40",
      contents: 100,
      votes: 390,
      contestsJoined: 310,
      contestsWin: 290,
      badgesEarned: 290
    },
    {
      id: 5,
      name: "Dalton Ward",
      image: "/api/placeholder/40/40",
      contents: 90,
      votes: 198,
      contestsJoined: 260,
      contestsWin: 100,
      badgesEarned: 100
    },
    {
      id: 6,
      name: "Arlana Paul",
      image: "/api/placeholder/40/40",
      contents: 460,
      votes: 78,
      contestsJoined: 150,
      contestsWin: 80,
      badgesEarned: 80
    }
  ];

  return (
    <div className="p-4">
      <ContributorsTable 
        contributors={sampleContributors} 
        currentPage={1} 
        totalPages={2} 
      />
    </div>
  );
}