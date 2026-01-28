import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeShow from './components/employee/EmployeeShow';
import EmployeeCreate from './components/employee/EmployeeCreate';
import EmployeeEdit from './components/employee/EmployeeEdit';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';
import UserList from './pages/user/UserList';
import UserCreate from './pages/user/UserCreate';
import UserEdit from './pages/user/UserEdit';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      //Users
      { path: '*', element: <UserList />},
      { path: '/user/create', element: <UserCreate />},
      { path: '/user/edit/:userId', element : <UserEdit />},
      //Employee
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
