export const API_ROUTES = [

]

export const APP_ROUTES = {
    LOGIN_PATH: 'login',
    //User
    USER_LIST_PATH: 'users',
    USER_CREATE_PATH: 'user/create',
    USER_EDIT_PATH: 'user/edit/:userId',
    USER_PERMISSION : 'user/permission',

    //Employee
    EMPLOYEE_LIST_PATH: '/employees',
    EMPLOYEE_CREATE_PATH: '/employee/create',
    EMPLOYEE_EDIT_PATH: '/employee/edit/:employeeID',

    //Equipments
    EQUIPMENT_LIST_PATH: '/equipments',
    EQUIPMENT_CREATE_PATH: '/equipment/create',
    EQUIPMENT_EDIT_PATH: '/equipment/edit/:equipmentID',

    //Inventory
    INVENTORY_LIST_PATH: '/inventories',
    INVENTORY_CREATE_PATH: '/inventory/create',
    INVENTORY_EDIT_PATH: '/inventory/edit/:inventoryID',

    //Profile
    PROFILE_SETTING_PATH: '/profile/setting',

    //Locations
    LOCATION_LIST_PATH: '/setting/locations',
    LOCATION_CREATE_PATH: '/setting/location/create',
    LOCATION_EDIT_PATH: '/setting/location/edit/:locationID',

    //ActionTypes
    ACTION_TYPE_LIST_PATH: '/setting/actionTypes',
    ACTION_TYPE_CREATE_PATH: '/setting/actionType/create',
    ACTION_TYPE_EDIT_PATH: '/setting/actionType/edit/:actionID',

    //Roles
    ROLE_LIST_PATH: '/setting/roles',
    ROLE_CREATE_PATH: '/setting/role/create',
    ROLE_EDIT_PATH: '/setting/role/edit/:roleID',

    //Permissions
    PERMISSION_LIST_PATH: '/setting/permissions',
    PERMISSION_CREATE_PATH: '/setting/permission/create',
    PERMISSION_EDIT_PATH: '/setting/permission/edit/:permissionID',

    //Features
    FEATURE_LIST_PATH: '/setting/features',
    FEATURE_CREATE_PATH: '/setting/feature/create',
    FEATURE_EDIT_PATH: '/setting/feature/edit/:featureID',
}