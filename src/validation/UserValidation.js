
export function userValidate(user) {
  let issues = [];

  if (!user.Username) {
    issues = [...issues, { message: 'نام کاربری الزامی است.', path: ['Username'] }];
  }

  // if (!user.Email) {
  //   issues = [...issues, { message: 'ایمیل الزامی است.', path: ['Email'] }];
  // } 
  // if (!user.Mobile) {
  //   issues = [...issues, { message: 'شماره موبایل الزامی است.', path: ['Mobile'] }];
  // } 
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