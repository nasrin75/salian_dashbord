export function CreateValidation(user) {
  let issues = [];

  if (!user.FaName) {
    issues = [...issues, { message: 'عنوان فارسی الزامی است.', path: ['FaName'] }];
  }
  if (!user.EnName) {
    issues = [...issues, { message: 'عنوان انگلیسی الزامی است.', path: ['EnName'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.faName) {
    issues = [...issues, { message: 'عنوان فارسی الزامی است.', path: ['faName'] }];
  }
  if (!user.enName) {
    issues = [...issues, { message: 'عنوان انگلیسی الزامی است.', path: ['enName'] }];
  }

  return { issues };
}