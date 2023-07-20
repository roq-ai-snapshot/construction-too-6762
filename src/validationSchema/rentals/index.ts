import * as yup from 'yup';

export const rentalValidationSchema = yup.object().shape({
  rental_start: yup.date().required(),
  rental_end: yup.date(),
  customer_id: yup.string().nullable(),
  tool_id: yup.string().nullable(),
  outlet_id: yup.string().nullable(),
});
