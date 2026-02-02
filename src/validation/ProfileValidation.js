
export function EditValidation(user) {
  let issues = [];

  if (!user.username) {
    issues = [...issues, { message: 'نام کاربری الزامی است.', path: ['username'] }];
  }
  return { issues };
}