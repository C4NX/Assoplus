import type { FetchContext } from 'ofetch';
import { toast } from 'vue3-toastify';
import type { unknown } from 'zod';

interface ValidationErrorResponse {
  validation: string;
  code: string;
  message: string;
  path: string[];
}

interface ValidationResponseData {
  issues: ValidationErrorResponse[];
  name: string;
}

function isValidationErrorResponse(obj: any): obj is ValidationResponseData {
  return (
    typeof obj === 'object' &&
    typeof obj.validation === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.message === 'string' &&
    Array.isArray(obj.path) &&
    obj.path.every((p: any) => typeof p === 'string')
  );
}

export function toastifyResponse(ctx: FetchContext) {
  const responseData = ctx.response?._data;

  if (typeof responseData?.message === "string") {
    if (ctx.response?.ok) {
      toast.success(responseData.message);
    } else {
      if (ctx.response?.status === 400 && typeof responseData?.data?.issues === 'object' && responseData.data.issues.every((item: any): item is ValidationErrorResponse => isValidationErrorResponse(item))) {
        const zodErrors = responseData.data.issues as ValidationErrorResponse[];
        zodErrors.forEach((error: ValidationErrorResponse) => {
          console.error(`${error.message} (Code: ${error.code}, Path: ${error.path.join(', ')})`)
          toast.error(error.message ?? 'An error occurred');
        });
      } else {
        toast.error(responseData.message);
      }
    }
  }
}