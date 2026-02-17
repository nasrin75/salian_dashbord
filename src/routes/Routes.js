import UserList from '../pages/user/UserList';
import UserEdit from '../pages/user/UserEdit';
import EmployeeList from '../pages/employee/List';
import EmployeeCreate from '../pages/employee/Create';
import EmployeeEdit from '../pages/employee/Edit';
import EquipmentList from '../pages/equipment/List';
import EquipmentCreate from '../pages/equipment/Create';
import EquipmentEdit from '../pages/equipment/Edit';
import LocationList from '../pages/location/List';
import LocationCreate from '../pages/location/Create';
import LocationEdit from '../pages/location/Edit';
import ActionTypeList from '../pages/action_type/List';
import ActionTypeCreate from '../pages/action_type/Create';
import ActionTypeEdit from '../pages/action_type/Edit';
import RoleList from '../pages/role/List';
import RoleCreate from '../pages/role/Create';
import RoleEdit from '../pages/role/Edit';
import PermissionList from '../pages/permission/List';
import PermissionCreate from '../pages/permission/Create';
import PermissionEdit from '../pages/permission/Edit'
import FeatureList from '../pages/feature/List';
import FeatureCreate from '../pages/feature/Create';
import FeatureEdit from '../pages/feature/Edit';
import ProfileSetting from '../pages/profile/Setting';
import Inventory from '../pages/inventory/List';
import InventoryCreate from '../pages/inventory/Create';
import InventoryEdit from '../pages/inventory/Edit';
import Login from '../pages/auth/Login';
import { createBrowserRouter } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';
import { RouterProvider } from 'react-router-dom';
import UserCreate from '../pages/user/UserCreate';
import { APP_ROUTES } from '../utlis/constants/routePath';
import AssignPermission from '../pages/user/AssignPermission';

const Routes = () => {

    // user can access this route when is login
    const RouteNeedToAuth = [{
        path: '/',
        Component: ProtectedRoutes,
        children: [
            //Users
            { path: APP_ROUTES.USER_LIST_PATH, element:<UserList />, index: true },
            { path: APP_ROUTES.USER_CREATE_PATH, element: <UserCreate /> },
            { path: APP_ROUTES.USER_EDIT_PATH, element: <UserEdit /> },
            { path: APP_ROUTES.USER_ASSIGN_PERMISSION_PATH, element: <AssignPermission /> },
            
            //Employees
            { path: APP_ROUTES.EMPLOYEE_LIST_PATH, element: <EmployeeList /> },
            { path: APP_ROUTES.EMPLOYEE_CREATE_PATH, element: <EmployeeCreate /> },
            { path: APP_ROUTES.EMPLOYEE_EDIT_PATH, element: <EmployeeEdit /> },
            //Equipments
            { path: APP_ROUTES.EQUIPMENT_LIST_PATH, element: <EquipmentList /> },
            { path: APP_ROUTES.EQUIPMENT_CREATE_PATH, element: <EquipmentCreate /> },
            { path: APP_ROUTES.EQUIPMENT_EDIT_PATH, element: <EquipmentEdit /> },

            //Locations
            { path: APP_ROUTES.LOCATION_LIST_PATH, element: <LocationList /> },
            { path: APP_ROUTES.LOCATION_CREATE_PATH, element: <LocationCreate /> },
            { path: APP_ROUTES.LOCATION_EDIT_PATH, element: <LocationEdit /> },

            //ActionTypes
            { path: APP_ROUTES.ACTION_TYPE_LIST_PATH, element: <ActionTypeList /> },
            { path: APP_ROUTES.ACTION_TYPE_CREATE_PATH, element: <ActionTypeCreate /> },
            { path: APP_ROUTES.ACTION_TYPE_EDIT_PATH, element: <ActionTypeEdit /> },

            //Roles
            { path: APP_ROUTES.ROLE_LIST_PATH, element: <RoleList /> },
            { path: APP_ROUTES.ROLE_CREATE_PATH, element: <RoleCreate /> },
            { path: APP_ROUTES.ROLE_EDIT_PATH, element: <RoleEdit /> },

            //Permissions
            { path: APP_ROUTES.PERMISSION_LIST_PATH, element: <PermissionList /> },
            { path: APP_ROUTES.PERMISSION_CREATE_PATH, element: <PermissionCreate /> },
            { path: APP_ROUTES.PERMISSION_EDIT_PATH, element: <PermissionEdit /> },

            //Features
            { path: APP_ROUTES.FEATURE_LIST_PATH, element: <FeatureList /> },
            { path: APP_ROUTES.FEATURE_CREATE_PATH, element: <FeatureCreate /> },
            { path: APP_ROUTES.FEATURE_EDIT_PATH, element: <FeatureEdit /> },


            //Profile
            { path: APP_ROUTES.PROFILE_SETTING_PATH, element: <ProfileSetting /> },
            //Inventory
            { path: APP_ROUTES.INVENTORY_LIST_PATH, element: <Inventory /> },
            { path: APP_ROUTES.INVENTORY_CREATE_PATH, element: <InventoryCreate /> },
            { path: APP_ROUTES.INVENTORY_EDIT_PATH, element: <InventoryEdit /> },

        ],
    }];

    // if user don't login can access this routes
    const RouteNotNeedToAuth = [
        {
            path: "/",
            Component: PublicRoutes,
            children: [
                { path: APP_ROUTES.LOGIN_PATH, element: <Login /> },
            ]
        }
    ];


    const router = createBrowserRouter([
        ...RouteNeedToAuth,
        ...RouteNotNeedToAuth
    ])


    return <RouterProvider router={router} />
}

export default Routes;
