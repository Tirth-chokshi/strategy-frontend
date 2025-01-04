const StrategyTimestamps = ({ createdAt, updatedAt }) => (
    <div className="space-y-4">
      <div className="text-sm">
        <span className="font-bold">Created At</span>:{" "}
        {new Date(createdAt).toLocaleString()}
      </div>
      <div className="text-sm">
        <span className="font-bold">Last Updated</span>:{" "}
        {new Date(updatedAt).toLocaleString()}
      </div>
    </div>
  );
  export default StrategyTimestamps