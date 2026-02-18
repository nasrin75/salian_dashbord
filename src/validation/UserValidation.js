
export function userValidate(user) {
  let issues = [];

  if (!user.Username) {
    issues = [...issues, { message: 'نام کاربری الزامی است.', path: ['Username'] }];
  }
  if (!user.Password) {
    issues = [...issues, { message: 'رمزعبور الزامی است.', path: ['Password'] }];
  }
  if (!user.RoleId) {
    issues = [...issues, { message: 'انتخاب الزامی است.', path: ['RoleId'] }];
  }
  if (!user.LoginTypes) {
    issues = [...issues, { message: 'انتخاب نحوه ورود الزامی است.', path: ['LoginTypes'] }];
  }

  return { issues };
}

export function userEditFormValidate(user) {
  let issues = [];

  if (!user.username) {
    issues = [...issues, { message: 'نام کاربری الزامی است.', path: ['username'] }];
  } 
  if (!user.password) {
    issues = [...issues, { message: 'رمزعبور الزامی است.', path: ['password'] }];
  }
  if (!user.roleId) {
    issues = [...issues, { message: 'انتخاب الزامی است.', path: ['roleId'] }];
  }
  if (!user.loginTypes) {
    issues = [...issues, { message: 'انتخاب نحوه ورود الزامی است.', path: ['loginTypes'] }];
  }

  return { issues };
}