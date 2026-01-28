const INITIAL_EMPLOYEES_STORE = [
  {
    id: 1,
    name: 'Edward Perry',
    age: 25,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Finance',
    isFullTime: true,
  },
  {
    id: 2,
    name: 'Josephine Drake',
    age: 36,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Market',
    isFullTime: false,
  },
  {
    id: 3,
    name: 'Cody Phillips',
    age: 19,
    joinDate: '2025-07-16T00:00:00.000Z',
    role: 'Development',
    isFullTime: true,
  },
];

export function getEmployeesStore() {
  const stringifiedEmployees = localStorage.getItem('employees-store');
  return stringifiedEmployees
    ? JSON.parse(stringifiedEmployees)
    : INITIAL_EMPLOYEES_STORE;
}

export function setEmployeesStore(employees) {
  return localStorage.setItem('employees-store', JSON.stringify(employees));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const employeesStore = getEmployeesStore();

  let filteredEmployees = [...employeesStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredEmployees = filteredEmployees.filter((employee) => {
        const employeeValue = employee[field];

        switch (operator) {
          case 'contains':
            return String(employeeValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return employeeValue === value;
          case 'startsWith':
            return String(employeeValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(employeeValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return employeeValue > value;
          case '<':
            return employeeValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredEmployees.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field] < b[field]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedEmployees = filteredEmployees.slice(start, end);

  return {
    items: paginatedEmployees,
    itemCount: filteredEmployees.length,
  };
}

export async function getOne(employeeId) {
  const employeesStore = getEmployeesStore();

  const employeeToShow = employeesStore.find(
    (employee) => employee.id === employeeId,
  );

  if (!employeeToShow) {
    throw new Error('Employee not found');
  }
  return employeeToShow;
}

export async function createOne(data) {
  const employeesStore = getEmployeesStore();

  const newEmployee = {
    id: employeesStore.reduce((max, employee) => Math.max(max, employee.id), 0) + 1,
    ...data,
  };

  setEmployeesStore([...employeesStore, newEmployee]);

  return newEmployee;
}

export async function updateOne(employeeId, data) {
  const employeesStore = getEmployeesStore();

  let updatedEmployee = null;

  setEmployeesStore(
    employeesStore.map((employee) => {
      if (employee.id === employeeId) {
        updatedEmployee = { ...employee, ...data };
        return updatedEmployee;
      }
      return employee;
    }),
  );

  if (!updatedEmployee) {
    throw new Error('Employee not found');
  }
  return updatedEmployee;
}

export async function deleteOne(employeeId) {
  const employeesStore = getEmployeesStore();

  setEmployeesStore(employeesStore.filter((employee) => employee.id !== employeeId));
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

export function validate(user) {
  let issues = [];

  if (!user.username) {
    issues = [...issues, { message: 'نام کاربری الزامی است.', path: ['username'] }];
  }

  if (!user.email) {
    issues = [...issues, { message: 'ایمیل الزامی است.', path: ['email'] }];
  } 
  if (!user.mobile) {
    issues = [...issues, { message: 'شماره موبایل الزامی است.', path: ['mobile'] }];
  } 
  if (!user.password) {
    issues = [...issues, { message: 'رمزعبور الزامی است.', path: ['password'] }];
  }
  if (!user.role) {
    issues = [...issues, { message: 'انتخاب الزامی است.', path: ['role'] }];
  }
  if (!user.loginTypes) {
    issues = [...issues, { message: 'انتخاب نحوه ورود الزامی است.', path: ['loginTypes'] }];
  } else if (!['otp', 'email', 'password','push'].includes(user.loginTypes)) {
    issues = [
      ...issues,
      {
        message: 'نحوه ورود باید یکی از موارد "OTP", "Email", "Password" or "Development" باشد',
        path: ['loginTypes'],
      },
    ];
  }

  return { issues };
}
