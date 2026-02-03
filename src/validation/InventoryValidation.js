export function CreateValidation(inventory) {
  let issues = [];

  if (!inventory.ItNumber) {
    issues = [...issues, { message: 'شماره IT الزامی است.', path: ['ItNumber'] }];
  }

   if (!inventory.EmployeeId) {
    issues = [...issues, { message: 'انتخاب مالک الزامی است.', path: ['EmployeeId'] }];
  }
  if (!inventory.EquipmentId) {
    issues = [...issues, { message: 'انتخاب قطعه الزامی است.', path: ['EquipmentId'] }];
  }
   if (!inventory.LocationId) {
    issues = [...issues, { message: 'انتخاب بخش الزامی است.', path: ['LocationId'] }];
  }
   if (!inventory.Status) {
    issues = [...issues, { message: 'یکی از وضعیت های زیر را انتخاب کنید', path: ['Status'] }];
  }
  //  if (!inventory.SerialNumber) {
  //   issues = [...issues, { message: 'شماره سریال الزامی است.', path: ['SerialNumber'] }];
  // }

  if (!inventory.DeliveryDate) {
    issues = [...issues, { message: 'تاریخ تحویل الزامی است.', path: ['DeliveryDate'] }];
  }

  return { issues };
}

export function EditValidation(inventory){
    let issues = [];

  if (!inventory.itNumber) {
    issues = [...issues, { message: 'شماره IT الزامی است.', path: ['itNumber'] }];
  }

   if (!inventory.employeeId) {
    issues = [...issues, { message: 'انتخاب مالک الزامی است.', path: ['employeeId'] }];
  }
  if (!inventory.equipmentId) {
    issues = [...issues, { message: 'انتخاب قطعه الزامی است.', path: ['equipmentId'] }];
  }
   if (!inventory.locationId) {
    issues = [...issues, { message: 'انتخاب بخش الزامی است.', path: ['locationId'] }];
  }
   if (!inventory.status) {
    issues = [...issues, { message: 'یکی از وضعیت های زیر را انتخاب کنید', path: ['status'] }];
  }
  //  if (!inventory.SerialNumber) {
  //   issues = [...issues, { message: 'شماره سریال الزامی است.', path: ['SerialNumber'] }];
  // }

  if (!inventory.deliveryDate) {
    issues = [...issues, { message: 'تاریخ تحویل الزامی است.', path: ['deliveryDate'] }];
  }

  return { issues };
}