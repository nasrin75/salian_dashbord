import UserList from '../pages/user/UserList';
import UserCreate from '../pages/user/UserCreate';
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
import DashboardLayout from '../components/DashboardLayout';
import { BrowserRouter, createBrowserRouter, createHashRouter } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import useAuth from '../hooks/useAuth/useAuth';
import PublicRoutes from './PublicRoutes';

const PrivateRoutes = createBrowserRouter([
    {
        Component: ProtectedRoutes,
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
    {
        Component: PublicRoutes,
        children: [
            { path: '/login', element: <Login /> },
        ]
    },
]);
export default PrivateRoutes;
const Routes = () => {
    const token = useAuth();

    const PublicRoutes = createHashRouter([
        {
            Component: DashboardLayout,
            children: [
                //Auth
                { path: '/*', element: <Login /> },
            ],
        }
    ]);

    const PrivateRoutes = createHashRouter([
        {
            Component: ProtectedRoutes,
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


    //return !token ? PublicRoutes : PrivateRoutes;
    return PublicRoutes;
}
//export default Routes;
