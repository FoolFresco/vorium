import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">My Account</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary-900 mb-6">Profile Information</h2>
        
        <form className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            value={user.name}
            leftIcon={<User size={18} />}
            readOnly
            fullWidth
          />
          
          <Input
            label="Email Address"
            type="email"
            value={user.email}
            leftIcon={<Mail size={18} />}
            readOnly
            fullWidth
          />
          
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            fullWidth
          />
          
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            fullWidth
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            fullWidth
          />
          
          <div className="flex justify-end">
            <Button type="submit">
              Update Profile
            </Button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-primary-900 mb-6">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="text-sm font-medium text-primary-900">Email Notifications</h3>
              <p className="text-sm text-primary-600">Receive updates about your orders</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                defaultChecked
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="text-sm font-medium text-primary-900">Marketing Emails</h3>
              <p className="text-sm text-primary-600">Receive promotional offers and updates</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-primary-600">Permanently delete your account and data</p>
            </div>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;