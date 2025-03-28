import { CheckIcon } from "@heroicons/react/24/outline";

export const PasswordStrengthIndicator = ({ strength }) => {
    const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];
  
    return (
      <div className="mt-2 space-y-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 w-full rounded-full transition-all duration-300 
                ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-500">
          Strength: {strengthLabels[strength - 1]}
        </span>
      </div>
    );
  };
  
 export  const PasswordRequirements = ({ password, confirmPassword }) => {
    const requirements = [
      { text: 'At least 8 characters', valid: password.length >= 8 },
      { text: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
      { text: 'Contains number', valid: /\d/.test(password) },
      { text: 'Contains special character', valid: /[!@#$%^&*]/.test(password) },
      { text: 'Passwords match', valid: password === confirmPassword && password !== '' },
    ];
  
    return (
      <div className="space-y-2">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckIcon
              className={`w-4 h-4 ${
                req.valid ? 'text-green-500' : 'text-gray-300'
              } transition-colors duration-200`}
            />
            <span
              className={`text-sm ${
                req.valid ? 'text-gray-600' : 'text-gray-400'
              } transition-colors duration-200`}
            >
              {req.text}
            </span>
          </div>
        ))}
      </div>
    );
  };