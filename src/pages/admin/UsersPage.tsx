import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { users } from '../../assets/mock-data';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Edit2, Trash2, UserPlus } from 'lucide-react';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [editingUser, setEditingUser] = useState<(typeof users)[0] | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleEdit = (user: (typeof users)[0]) => {
    setEditingUser(user);
    setShowAddForm(false);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // сделать апи кол
      alert('User deleted successfully');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex-1 ml-64 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingUser(null);
          }}
          leftIcon={<UserPlus size={18} />}
        >
          Add User
        </Button>
      </div>

      {(showAddForm || editingUser) && (
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-semibold mb-6">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form className="grid grid-cols-2 gap-6">
            <Input
              label="Full Name"
              defaultValue={editingUser?.name}
              required
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              defaultValue={editingUser?.email}
              required
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              placeholder={editingUser ? '••••••••' : ''}
              required={!editingUser}
              fullWidth
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                defaultChecked={editingUser?.isAdmin}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAdmin"
                className="ml-2 block text-sm text-gray-900"
              >
                Admin User
              </label>
            </div>
            <div className="col-span-2 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-primary-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-primary-500">
                          ID: #{user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
