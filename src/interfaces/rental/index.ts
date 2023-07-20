import { UserInterface } from 'interfaces/user';
import { ToolInterface } from 'interfaces/tool';
import { OutletInterface } from 'interfaces/outlet';
import { GetQueryInterface } from 'interfaces';

export interface RentalInterface {
  id?: string;
  customer_id?: string;
  tool_id?: string;
  outlet_id?: string;
  rental_start: any;
  rental_end?: any;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  tool?: ToolInterface;
  outlet?: OutletInterface;
  _count?: {};
}

export interface RentalGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  tool_id?: string;
  outlet_id?: string;
}
