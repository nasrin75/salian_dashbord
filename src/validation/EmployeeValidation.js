export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'نام الزامی است.', path: ['Name'] }];
  }
  if (!user.LocationId) {
    issues = [...issues, { message: 'موقعیت الزامی است.', path: ['LocationId'] }];
  }
  if(user.Email !== null && user.Email !== undefined && String(user.Email).trim() !== ''){
    const email = String(user.Email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       issues = [...issues, { message: 'فرمت ایمیل نامعتبر است.', path: ['Email'] }];
    }
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
  if(user.email !== null && user.email !== undefined && String(user.email).trim() !== ''){
    const email = String(user.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       issues = [...issues, { message: 'فرمت ایمیل نامعتبر است.', path: ['email'] }];
    }
  }

  return { issues };
}