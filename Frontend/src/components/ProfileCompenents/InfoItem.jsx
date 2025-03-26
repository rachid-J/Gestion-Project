export const InfoItem = ({ Icon,label, value }) => (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm text-gray-500">{value || `Not ${label.toLowerCase()}`}</p>
      </div>
    </div>
  );