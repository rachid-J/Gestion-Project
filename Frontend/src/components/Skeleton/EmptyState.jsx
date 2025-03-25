import { Button } from "../UI/Button";


export const EmptyState = ({ 
  title, 
  description, 
  icon = "📭", 
  actionLabel, 
  onAction, 
  className = "" 
}) => {
  return (
    <div className={`p-8 text-center ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4 text-gray-300">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};