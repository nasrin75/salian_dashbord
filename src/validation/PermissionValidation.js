export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['Name'] }];
  }
  return { issues };
}

export function EditValidation(user) {
  let issues = [];

  if (!user.name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['name'] }];
  }

  return { issues };
}