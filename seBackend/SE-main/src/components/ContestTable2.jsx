
const ContestTable2 = ({ data: initialData }) => {



    return (
      <div className="w-full">
        {/* Make table scrollable horizontally on small screens */}
        <div className="overflow-x-auto rounded-lg">
          <table className=" w-full">
            <thead>
              <tr className="bg-[#ceb46a] text-black">
                <th className="py-4 px-6 text-left">Gallery</th>
                <th className="py-4 px-6 text-left">Contest Name</th>
                <th className="py-4 px-6 text-left">Win Date</th>
                <th className="py-4 px-6 text-left">Position</th>
                <th className="py-4 px-6 text-left">Upvotes</th>
              </tr>
            </thead>
            <tbody>
              {initialData.map((contest, index) => (
                <tr
                  key={contest.id}
                  className={index % 2 === 0 ? 'bg-[#161617] text-white' : 'bg-[#1C1C1E] text-white'}
                >
                  <td className="py-4 px-6">{contest.gallery}</td>
                  <td className="py-4 px-6">{contest.name}</td>
                  <td className="py-4 px-6">{contest.winDate}</td>
                  <td className="py-4 px-6">{contest.position}</td>
                  <td className="py-4 px-6">{contest.upvotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default ContestTable2;
  