const Skeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/4"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

export default Skeleton;