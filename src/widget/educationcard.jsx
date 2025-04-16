const EducationCard = ({ title, icon, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={`w-[90%] sm:w-[230px] h-[270px] flex flex-col justify-center items-center 
        bg-white rounded-xl shadow-md p-6 text-center transition-all 
        ${isSelected ? "ring-2 ring-blue-400" : "hover:shadow-lg"} 
        border border-[#2D8D82]`}
    >
      <img src={icon} alt={title} className="w-30 h-30 sm:w-40 sm:h-40 mb-3 object-contain" />
      <span className="font-semibold text-[#2D8D82] capitalize text-lg sm:text-xl">{title}</span>
    </button>
  );
};

export default EducationCard;
