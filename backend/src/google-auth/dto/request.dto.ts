export class RequestScriptRunDto {
  functionName: 'healthCheckFunction' | 'getSheetAllData' | 'insertDataToTargetSheet';
  params?: (string | number)[];
}
