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
import EmployeeList from './pages/employee/List';
import EmployeeCreate from './pages/employee/Create';
import EmployeeEdit from './pages/employee/Edit';
import EquipmentList from './pages/equipment/List';
import EquipmentCreate from './pages/equipment/Create';
import EquipmentEdit from './pages/equipment/Edit';
import LocationList from './pages/location/List';
import LocationCreate from './pages/location/Create';
import LocationEdit from './pages/location/Edit';
import ActionTypeList from './pages/action_type/List';
import ActionTypeCreate from './pages/action_type/Create';
import ActionTypeEdit from './pages/action_type/Edit';
import RoleList from './pages/role/List';
import RoleCreate from './pages/role/Create';
import RoleEdit from './pages/role/Edit';
import PermissionList from './pages/permission/List';
import PermissionCreate from './pages/permission/Create';
import PermissionEdit from './pages/permission/Edit'
import FeatureList from './pages/feature/List';
import FeatureCreate from './pages/feature/Create';
import FeatureEdit from './pages/feature/Edit';
import ProfileSetting from './pages/profile/Setting';
import Inventory from './pages/inventory/List';
import InventoryCreate from './pages/inventory/Create';
import InventoryEdit from './pages/inventory/Edit';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from './config/dateConfig';
import "dayjs/locale/fa"

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

      {
        path: '/setting/', children: [
          //Locations
          { path: 'locations', element: <LocationList /> },
          { path: 'location/create', element: <LocationCreate /> },
          { path: 'location/edit/:locationID', element: <LocationEdit /> },

          //ActionTypes
          { path: 'actionTypes', element: <ActionTypeList /> },
          { path: 'actionType/create', element: <ActionTypeCreate /> },
          { path: 'actionType/edit/:actionID', element: <ActionTypeEdit /> },

          //Roles
          { path: 'roles', element: <RoleList /> },
          { path: 'role/create', element: <RoleCreate /> },
          { path: 'role/edit/:roleID', element: <RoleEdit /> },

          //Permissions
          { path: 'permissions', element: <PermissionList /> },
          { path: 'permission/create', element: <PermissionCreate /> },
          { path: 'permission/edit/:permissionID', element: <PermissionEdit /> },

          //Features
          { path: 'features', element: <FeatureList /> },
          { path: 'feature/create', element: <FeatureCreate /> },
          { path: 'feature/edit/:featureID', element: <FeatureEdit /> },
        ]
      },


      //Profile
      { path: 'profile/setting', element: <ProfileSetting /> },
      //Inventory
      { path: 'inventories', element: <Inventory /> },
      { path: 'inventory/create', element: <InventoryCreate /> },
      { path: 'inventory/edit/:inventoryID', element: <InventoryEdit /> },

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
      <LocalizationProvider
       dateAdapter={AdapterDayjs}
       adapterLocale="fa"
       dateLibInstance={dayjs}
       >
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
    </LocalizationProvider>
  );
}
