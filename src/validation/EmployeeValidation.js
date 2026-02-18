export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'نام الزامی است.', path: ['Name'] }];
  }
  if (!user.LocationId) {
    issues = [...issues, { message: 'موقعیت الزامی است.', path: ['LocationId'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.name) {
    issues = [...issues, { message: 'نام الزامی است.', path: ['name'] }];
  }
  if (!user.locationId) {
    issues = [...issues, { message: 'موقعیت الزامی است.', path: ['locationId'] }];
  }

  return { issues };
}