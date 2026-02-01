import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';

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
import EmployeeList from './pages/employee/EmployeeList';
import EmployeeCreate from './pages/employee/EmployeeCreate';
import EmployeeEdit from './pages/employee/EmployeeEdit';
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentCreate from './pages/equipment/EquipmentCreate';
import EquipmentEdit from './pages/equipment/EquipmentEdit';
import LocationList from './pages/location/LocationList';
import LocationCreate from './pages/location/LocationCreate';
import LocationEdit from './pages/location/LocationEdit';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      //Users
      { path: '/*', element: <UserList />, index: true },
      { path: '/user/create', element: <UserCreate /> },
      { path: '/user/edit/:userId', element: <UserEdit /> },
      //Employees
      { path: '/employees', element: <EmployeeList /> },
      { path: '/employee/create', element: <EmployeeCreate /> },
      { path: '/employee/edit/:employeeID', element: <EmployeeEdit /> },
      //Equipments
      { path: '/equipments', element: <EquipmentList /> },
      { path: '/equipment/create', element: <EquipmentCreate /> },
      { path: '/equipment/edit/:equipmentID', element: <EquipmentEdit /> },

      //Locations
      { path: '/setting/locations', element: <LocationList /> },
      { path: '/setting/location/create', element: <LocationCreate /> },
      { path: '/setting/location/edit/:locationID', element: <LocationEdit /> },
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
